import { Entity, Column, PrimaryColumn, CreateDateColumn } from "typeorm";

@Entity('TB_MANAGER_MST')
export class ManagerMstEntity {
    @PrimaryColumn({ name: 'MANAGER_ID', type: 'varchar2' })
    managerId: string

    @Column({ name: 'PWD', type: 'varchar2' })
    pwd: string

    @Column({ name: 'MANAGER_NM', type: 'varchar2' })
    managerNm: string

    @Column({ name: 'HP', type: 'varchar2' })
    hp: string

    @Column({ name: 'DEPT_NM', type: 'varchar2' })
    deptName: string
    
    @Column({ name: 'GRADE_GBN', type: 'varchar2' })
    gradeGbn: string

    @Column({ name: 'STATUS_GBN', type: 'varchar2' })
    statusGbn: string

    @Column({ name: 'ID_GBN', type: 'varchar2' })
    idGbn: string

    @Column({ name: 'MEMO', type: 'varchar2' })
    memo: string

    @Column({ name: 'REG_DATE', type: 'timestamp' })
    regDate: Date

    @Column({ name: 'REG_ID', type: 'varchar2' })
    regId: string

    @Column({ name: 'REG_IP', type: 'varchar2' })
    regIp: string

    @Column({ name: 'MOD_DATE', type: 'timestamp' })
    modDate: Date

    @Column({ name: 'MOD_ID', type: 'varchar2' })
    modId: string

    @Column({ name: 'MOD_IP', type: 'varchar2' })
    modIp: string

    @Column({ name: 'RETIRE_DATE', type: 'timestamp' })
    retireDate: Date

    @Column({ name: 'RETIRE_ID', type: 'varchar2' })
    retireId: string

    @Column({ name: 'RETIRE_IP', type: 'varchar2' })
    retireIp: string

    @Column({ name: 'DEL_DATE', type: 'timestamp' })
    delDate: Date

    @Column({ name: 'DEL_ID', type: 'varchar2' })
    delId: string

    @Column({ name: 'DEL_IP', type: 'varchar2' })
    delIp: string

    @Column({ name: 'S_LOCATION_INFO_AUTH', type: 'varchar2' })
    sLocationInfoAuth: string
}