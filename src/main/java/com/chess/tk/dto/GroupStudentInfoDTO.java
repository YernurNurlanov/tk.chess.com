package com.chess.tk.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class GroupStudentInfoDTO extends GroupBaseDTO {
    private List<StudentBaseDTO> studentInfos;

    public GroupStudentInfoDTO(Long id, String groupName, List<StudentBaseDTO> studentInfos) {
        this.setId(id);
        this.setGroupName(groupName);
        this.studentInfos = studentInfos;
    }
}
