package com.chess.tk.dto;


import java.util.List;

public class GroupStudentInfoDTO extends GroupBaseDTO {
    private List<StudentBaseDTO> studentInfos;

    public GroupStudentInfoDTO(Long id, String groupName, List<StudentBaseDTO> studentInfos) {
        this.setId(id);
        this.setGroupName(groupName);
        this.studentInfos = studentInfos;
    }
}
