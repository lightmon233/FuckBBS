package com.example.fullstackforum.topic;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Objects;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/topics/")
@Slf4j
public class TopicController {

    private final TopicService topicService;

    @GetMapping("{id}")
    public TopicWithPostsDto getTopicWithPosts(@PathVariable("id") Integer id) {
        return topicService.getTopicWithPostsByTopicId(id);
    }

    @PostMapping("topic")
    public TopicDto createNewTopic(@RequestBody NewTopicRequest request) {
        return topicService.createNewTopic(request);
    }

    @DeleteMapping("{id}")
    public DeleteTopicResponse deleteTopic(@PathVariable Integer id) {
        return topicService.deleteTopic(id);
    }

    @PutMapping("{id}")
    public TopicDto updateTopic(@PathVariable Integer id, @RequestBody TopicDto updatedDto) {
        if (!Objects.equals(id, updatedDto.id())) {
            log.warn("Path variable id and RequestBody id do not match");
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Path variable id and RequestBody id do not match"
            );
        }
        return topicService.updateTopic(updatedDto);
    }
}
