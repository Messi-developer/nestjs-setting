import { Injectable } from '@nestjs/common'

export type ResponsePageNation = {
    page: number // 현재 페이지
    listScale: number // 리스트 노출수
    minPage: number // 시작페이지
    maxPage: number // 마지막페이지
    // totalPage: number // 전체페이지수
    totalCount: number // 총 데이터수
}

@Injectable()
export class PageNationService {
    public async pageNation(params: { total: number; page: number; limit: number }) {
        // const totalPage = Math.ceil(params.total / params.limit)
        const minPage = 1
        const maxPage = Math.max(1, Math.ceil(params.total / params.limit))
        // const totalPage = Math.max(1, Math.ceil(params.total / params.limit))

        // const minPage = Math.floor((params.page - 1) / 10) * 10 + 1 // 페이지 네비게이션의 시작 페이지 계산
        // const maxPage = minPage + 9 > totalPage ? totalPage : minPage + 9 // 페이지 네비게이션의 끝 페이지 계산

        // const minIndex = (params.page - 1) * params.limit
        // const maxIndex = Math.min(minIndex + params.limit - 1, params.total - 1)
        // const pages = Array.from(Array(maxPage + 1 - minPage).keys()).map((i) => minPage + i)

        return {
            page: +params.page,
            listScale: +params.limit,
            minPage: +minPage,
            maxPage: +maxPage,
            // totalPage: +totalPage, // 사용안함으로 변경(예정)
            totalCount: +params.total,
        }
    }
}
