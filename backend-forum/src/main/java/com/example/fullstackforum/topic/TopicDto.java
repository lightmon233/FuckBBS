package com.example.fullstackforum.topic;

import lombok.Builder;

import java.util.Date;

@Builder
public record TopicDto(
        Integer id,
        String header,
        String message,
        String creator,
        Date createdTime,
        Date updatedTime,
        String user,
        Integer userId
) {
}
