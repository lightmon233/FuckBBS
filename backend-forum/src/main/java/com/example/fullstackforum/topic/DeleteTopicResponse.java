package com.example.fullstackforum.topic;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@AllArgsConstructor
public class DeleteTopicResponse {
    private String message;
    private Integer topicId;
}