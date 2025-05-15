package com.chess.tk.db.repository;

import com.chess.tk.db.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findByTeacherId(Long lessonId);

    @Query("SELECT l FROM Lesson l WHERE l.teacherId = :teacherId AND l.id <> :excludeId AND " +
            "(:startTime < l.endTime AND :endTime > l.startTime)")
    List<Lesson> findOverlappingLessonsByTeacherExcludeId(@Param("teacherId") Long teacherId,
                                                          @Param("startTime") LocalDateTime startTime,
                                                          @Param("endTime") LocalDateTime endTime,
                                                          @Param("excludeId") Long excludeId);

    @Query("SELECT l FROM Lesson l WHERE l.teacherId = :teacherId AND " +
            "(:startTime < l.endTime AND :endTime > l.startTime)")
    List<Lesson> findOverlappingLessonsByTeacher(@Param("teacherId") Long teacherId,
                                                 @Param("startTime") LocalDateTime startTime,
                                                 @Param("endTime") LocalDateTime endTime);

}
