package com.chess.tk.exception;

public class StudentAlreadyInGroupException extends RuntimeException {
    public StudentAlreadyInGroupException(Long studentId) {
        super("Student with id " + studentId + " is already in the group");
    }
}
