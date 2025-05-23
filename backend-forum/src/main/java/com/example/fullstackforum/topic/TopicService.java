package com.example.fullstackforum.topic;

import com.example.fullstackforum.auth.AuthenticationService;
import com.example.fullstackforum.board.BoardRepository;
import com.example.fullstackforum.user.Role;
import com.example.fullstackforum.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Slf4j
public class TopicService {

    private final TopicRepository topicRepository;
    private final TopicMapper topicMapper;
    private final AuthenticationService authenticationService;
    private final BoardRepository boardRepository;

    public TopicWithPostsDto getTopicWithPostsByTopicId(Integer id) {
        log.info("Getting topic with posts by topic id: {}", id);

        var topicDb = topicRepository.findById(id);

        if (topicDb.isEmpty()) {
            log.warn("No topic found with id: {}", id);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No topic with id " + id);
        }

        var topic = topicDb.get();

        log.info("Filtering deleted posts");
        var onlyNotDeletedPosts = topic.getPosts().stream()
                .filter(post -> !post.isDeleted())
                .toList();

        topic.setPosts(onlyNotDeletedPosts);
        return topicMapper.mapTopicToTopicWithPostsDto(topic);
    }

    public Topic getTopicById(Integer id) {
        var topic = topicRepository.findById(id);

        if (topic.isEmpty()) {
            log.warn("No topic found with id: {}", id);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No topic with id " + id);
        }

        return topic.get();
    }

    public TopicDto createNewTopic(NewTopicRequest request) {
        log.info("Creating new topic with request: {}", request);

        var user = authenticationService.getAuthenticatedRequestUser();

        var board = boardRepository.findByName(request.boardName());

        if (board.isEmpty()) {
            log.warn("No board found with board name: {}", request.boardName());
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "No board found with name: " + request.boardName()
            );
        }

        var topic = Topic.builder()
                .message(request.message())
                .heading(request.heading())
                .board(board.get())
                .user(user)
                .build();

        var topicDb = topicRepository.save(topic);

        log.info("Topic created successfully, topic id: {}", topic.getId());

        return topicMapper.mapTopicToDto(topicDb);
    }

    public DeleteTopicResponse deleteTopic(Integer topicId) {
        log.info("Deleting topic, topicId: {}", topicId);

        var user = authenticationService.getAuthenticatedRequestUser();
        var topicOpt = topicRepository.findById(topicId);

        if (topicOpt.isEmpty()) {
            log.warn("No topic with topicId: {}", topicId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found with id " + topicId);
        }

        var topic = topicOpt.get();

        if (isUserNotAllowedInteractWithTopic(topic, user)) {
            log.warn("User not allowed to delete topic, topicId: {}, userId: {}", topic.getId(), user.getId());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not allowed to delete topic");
        }

        // 这里是软删除，设置 deleted 标志，数据库表需要有该字段
        topic.setDeleted(true);
        topicRepository.save(topic);

        log.info("Set isDeleted true successfully: {}", topic.getId());

        return new DeleteTopicResponse("Successfully deleted topic", topicId);
    }

    public TopicDto updateTopic(TopicDto updatedTopic) {
        var requestUser = authenticationService.getAuthenticatedRequestUser();

        log.info("Updating topic, id: {}", updatedTopic.id());
        var topicOpt = topicRepository.findById(updatedTopic.id());

        if (topicOpt.isEmpty()) {
            log.warn("Topic not found with id {}", updatedTopic.id());
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Topic not found with id " + updatedTopic.id());
        }

        var originalTopic = topicOpt.get();

        if (isUserNotAllowedInteractWithTopic(originalTopic, requestUser)) {
            log.warn("User not allowed to edit topic, topicId: {}, userId: {}", originalTopic.getId(), requestUser.getId());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not allowed to edit topic");
        }

        originalTopic.setHeading(updatedTopic.header());
        originalTopic.setMessage(updatedTopic.message());

        var updatedDb = topicRepository.save(originalTopic);
        return topicMapper.mapTopicToDto(updatedDb);
    }

    private boolean isUserNotAllowedInteractWithTopic(Topic topic, User user) {
        boolean isUsersOwnTopic = topic.getUser() != null && topic.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == Role.ADMIN;

        return !isAdmin && !isUsersOwnTopic;
    }
}
