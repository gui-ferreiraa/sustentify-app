package com.sustentify.sustentify_app.app.redis;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RedisService {

    private final RedisTemplate<String, String> redisTemplate;

    public RedisService(RedisTemplate<String, String> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void put(String key, String value, Duration duration) {
        redisTemplate.opsForValue().set(key, value, duration);
    }

    public <T> T get(String key) {
        return (T) redisTemplate.opsForValue().get(key);
    }

    public boolean exists(String key) {
        return redisTemplate.hasKey(key);
    }

    public void remove(String key) {
        redisTemplate.delete(key);
    }

    public Duration getRemainingTTL(String key) {
        Long ttl = redisTemplate.getExpire(key);
        if (ttl != null && ttl > 0) {
            return Duration.ofSeconds(ttl);
        }
        return Duration.ZERO;
    }
}
