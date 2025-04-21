package com.chess.tk.dto;

import com.chess.tk.db.entity.Group;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GroupBaseDTO {

    @NotNull(message = "Id must not be null")
    @Min(value = 1, message = "Id must be more than 0")
    private Long id;

    @NotNull(message = "Group name must not be null")
    private String groupName;

    public GroupBaseDTO(Group group) {
        this.id = group.getId();
        this.groupName = group.getGroupName();
    }
}
