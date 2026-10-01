import type { CraftClass } from "@/types";

export const classes: readonly CraftClass[] = [
  {
    id: "pottery-class",
    name: "도자기 만들기",
    description: "물레 위에서 흙의 결을 느끼며 나만의 찻잔을 빚어 보는 시간입니다.",
    price: 55000,
    durationMinutes: 150,
    capacity: 6,
    image: "/images/classes/pottery-class.svg",
    imageAlt: "물레 위에서 빚어지는 연한 베이지색 찻잔 모양의 흙 그림",
  },
  {
    id: "bojagi-class",
    name: "보자기 만들기",
    description: "조각 천을 이어 바느질하며 은은한 색의 보자기를 완성합니다.",
    price: 42000,
    durationMinutes: 120,
    capacity: 8,
    image: "/images/classes/bojagi-class.svg",
    imageAlt: "바늘과 실이 꽂힌 조각보 천이 접혀 있는 그림",
  },
  {
    id: "woodwork-class",
    name: "목공예 트레이 만들기",
    description: "결을 살려 나무를 다듬고 오일로 마감하는 작은 쟁반 만들기입니다.",
    price: 68000,
    durationMinutes: 180,
    capacity: 4,
    image: "/images/classes/woodwork-class.svg",
    imageAlt: "대패와 나무 쟁반이 놓여 있는 작업대 그림",
  },
];
