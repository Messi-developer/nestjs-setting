import { Transform, Exclude } from 'class-transformer';
import { Entity, Column, PrimaryColumn, CreateDateColumn } from 'typeorm';
import * as dayjs from 'dayjs';

@Entity('TB_MEMBER_MST')
export class MemberMstEntity {
    @PrimaryColumn('number', {
        name: 'MEMBER_CD',
    })
    memberCd: number;

    @Column('varchar2', {
        name: 'HP',
    })
    hp: string;

    @Column('varchar2', {
        name: 'PWD',
    })
    @Exclude()
    pwd: string;

    @Column('varchar2', {
        name: 'MEMBER_GBN',
    })
    memberGbn: string;

    @Column('varchar2', {
        name: 'MEMBER_NM',
    })
    memberNm: string;

    @Column('varchar2', {
        name: 'CP_CD',
    })
    cpCd: string;

    @Column('varchar2', {
        name: 'PRE_CP_CD',
    })
    preCpCd: string;

    @Column('varchar2', {
        name: 'PRE_CP_NM',
    })
    preCpNm: string;

    @Column('varchar2', {
        name: 'VOICE_AUTH_YN',
    })
    voiceAuthYn: string;

    @Column('varchar2', {
        name: 'IS_TEL_COLLECT_YN',
    })
    isTelCollectYn: string;

    @Column('timestamp', {
        name: 'IS_TEL_COLLECT_DATE',
    })
    @Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null))
    isTelCollectDate: Date;

    @Column('varchar2', {
        name: 'IS_TEL_DENY_COLLECT_YN',
    })
    isTelDenyCollectYn: string;

    @Column('timestamp', {
        name: 'IS_TEL_DENY_COLLECT_DATE',
    })
    @Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null))
    isTelDenyCollectDate: Date;

    @Column('timestamp', {
        name: 'PASSWD_MOD_DATE',
    })
    @Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null))
    passwdModDate: Date;

    @Column('varchar2', {
        name: 'EMAIL',
    })
    email: string;

    @Column({
        type: 'varchar2',
        name: 'PROFILE_PATH',
    })
    profilePath: string;

    @Column({
        type: 'varchar2',
        name: 'ID_CARD_PATH',
    })
    idCardPath: string;

    @Column('varchar2', {
        name: 'CERT_NO',
    })
    certNo: string;

    @Column({
        type: 'varchar2',
        name: 'CERT_PATH',
    })
    certPath: string;

    @CreateDateColumn({
        type: 'timestamp',
        name: 'REQ_DATE',
        default: Date(),
    })
    @Transform(({ value }) => dayjs(value).format('YYYY-MM-DD HH:mm:ss'))
    reqDate: Date;

    @Column('varchar2', {
        name: 'STATUS_GBN',
        default: 'A',
    })
    statusGbn: string;

    @Column('timestamp', {
        name: 'CONFIRM_DATE',
    })
    @Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null))
    confirmDate: Date;

    @Column('timestamp', {
        name: 'DROP_DATE',
    })
    @Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null))
    dropDate: Date;

    @Column('varchar2', {
        name: 'RECOMMEND_CD',
    })
    recommendCd: string;

    @Column('varchar2', {
        name: 'MARKETER_ID',
    })
    marketerId: string;

    @Column('varchar2', {
        name: 'RECOMMEND_MEMBER',
    })
    recommendMember: string;

    @Column({
        type: 'varchar2',
        name: 'NICK_NM',
    })
    nickNM: string;

    @Column({
        type: 'varchar2',
        name: 'IS_HOMEPAGE_TRM',
    })
    isHomePageTrm: string;

    @Column('varchar2', {
        name: 'HOMEPAGE_TRM_YMD',
    })
    homepageTrmYmd: string;

    @Column({
        type: 'varchar2',
        name: 'IS_PERSONAL_TRM',
    })
    isPersonalTrm: string;

    @Column('varchar2', {
        name: 'PERSONAL_TRM_YMD',
    })
    personalTrmYmd: string;

    @Column({
        type: 'varchar2',
        name: 'IS_ALARM_TRM',
    })
    isAlarmTrm: string;

    @Column('varchar2', {
        name: 'ALARM_TRM_YMD',
    })
    alarmTrmYmd: string;

    @Column({
        type: 'varchar2',
        name: 'IS_USE_STT',
    })
    isUseSTT: string;

    @Column({
        type: 'varchar2',
        name: 'FCM_TOKEN',
    })
    fcmToken: string;

    @Column({
        type: 'varchar2',
        name: 'BIRTH',
    })
    birth: string;

    @Column({
        type: 'varchar2',
        name: 'GENDER',
    })
    gender: string;

    @Column({
        type: 'varchar2',
        name: 'ID_CARD_YMD',
    })
    idCardYMD: string;

    @Column({
        type: 'varchar2',
        name: 'IS_TESTER',
    })
    isTester: string;

    @Column({
        type: 'timestamp',
        name: 'LAST_LOGIN_DATE',
    })
    @Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null))
    lastLoginDate: Date;

    @Column({
        type: 'varchar2',
        name: 'VALID_GBN',
    })
    validGbn: string;

    @Column({
        type: 'timestamp',
        name: 'VALID_DATE',
    })
    @Transform(({ value }) => (value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : null))
    validDate: Date;

    @Column({
        type: 'varchar2',
        name: 'PERMIT_GBN',
    })
    permitGbn: string;

    @Column({
        type: 'varchar2',
        name: 'IS_TEL_TRM',
    })
    isTelTrm: string;

    @Column({
        type: 'varchar2',
        name: 'IS_TEL_TRM_DATE',
    })
    isTelTrmDate: string;

    @Column({
        type: 'varchar2',
        name: 'IS_PRIVACY',
    })
    isPrivacy: string;

    @Column({
        type: 'varchar2',
        name: 'IS_SMS',
    })
    isSms: string;

    @Column({
        type: 'varchar2',
        name: 'IS_PUSH',
    })
    isPush: string;

    @Column('varchar2', {
        name: 'AD_TRM_YMD',
    })
    adTrmYmd: string;

    @Column({
        type: 'varchar2',
        name: 'IS_PRIVACY_DATE',
    })
    isPrivacyDate: string;

    @Column('number', {
        name: 'N_INTEGRATION_MEMBER_CODE',
    })
    nIntegrationMemberCode: number;

    @Column({
        type: 'varchar2',
        name: 'S_INTEGRATE_YN',
    })
    sIntegrateYn: string;

    @Column({
        type: 'varchar2',
        name: 'S_SERVICECODE',
    })
    sServicecode: string;

    @Column({
        type: 'varchar2',
        name: 'IS_HOUSE_PICTURE',
    })
    isHousePicture: string;

    @Column({
        type: 'varchar2',
        name: 'IS_HOUSE_PICTURE_DATE',
    })
    isHousePictureDate: string;
}
