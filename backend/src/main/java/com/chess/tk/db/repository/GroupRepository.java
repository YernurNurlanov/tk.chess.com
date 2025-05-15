package com.chess.tk.db.repository;

import com.chess.tk.db.entity.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findByTeacherId(Long id);

    @Query("SELECT g FROM Group g WHERE :studentId MEMBER OF g.studentIds")
    List<Group> findByStudentId(Long studentId);
}
