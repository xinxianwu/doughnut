package com.odde.doughnut.entities.repositories;

import com.odde.doughnut.entities.ReviewPointEntity;
import com.odde.doughnut.entities.UserEntity;
import org.springframework.data.repository.CrudRepository;

import java.sql.Timestamp;
import java.util.List;

public interface ReviewPointRepository extends CrudRepository<ReviewPointEntity, Integer> {
    List<ReviewPointEntity> findAllByUserEntityAndInitialReviewedAtGreaterThan(UserEntity userEntity, Timestamp since);
    List<ReviewPointEntity> findAllByUserEntityAndNextReviewAtLessThanEqualOrderByNextReviewAt(UserEntity userEntity, Timestamp nextReviewAt);
}
