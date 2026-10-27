const apartment = '/portfolio/single-apartment'
const family = '/portfolio/family-home'

export const singleApartmentDiagrams = [
  { title: '彩色平面图', meta: '起居、餐厨与电竞空间的整体布局', src: `${apartment}/diagrams/floor-plan.jpeg` },
  { title: '功能分区', meta: '开放式卧房、餐厨休闲区与休息电竞区', src: `${apartment}/diagrams/zoning.png` },
  { title: '客厅材质分析', meta: '电视墙、收纳、沙发与软装的拆解表达', src: `${apartment}/diagrams/living-materials.jpeg` },
  { title: '厨房材质分析', meta: '柜体、台面、灯具与地面材料的搭配', src: `${apartment}/diagrams/kitchen-materials.jpeg` },
]

export const singleApartmentRenderProcess = {
  title: '从白模到 AI 效果图',
  description: '以客厅和电竞房白模为空间参照，对照 AI 效果图中的材质、光线与陈设表达，呈现从空间体量到生活氛围的变化。',
  stages: [
    { title: '白模输入', text: '明确空间体量、家具布局与观察视角。' },
    { title: 'AI 渲染表达', text: '围绕设计意向推演材质、光线与空间氛围。' },
    { title: '方案整理', text: '结合效果图、功能分区与材质图解呈现设计。' },
  ],
  cases: [
    {
      title: '客厅 · 轻简松弛',
      description: '从白模中的转角沙发、茶几与背景墙出发，以浅灰、原木和柔和光线建立起居氛围，呈现收纳与休憩的复合关系。',
      before: { title: '客厅白模', meta: '空间体量与家具布局', src: `${apartment}/process/living-white-model.png` },
      after: { title: '客厅 AI 效果图', meta: '材质、灯光与起居氛围', src: `${apartment}/renders/render-01.png` },
    },
    {
      title: '电竞房 · 功能与陈列',
      description: '以书架、窗洞和桌面的白模布局为起点，在效果图中呈现木质柜体、电竞设备与收藏展示，让功能与个人兴趣共同构成空间。',
      before: { title: '电竞房白模', meta: '书架、窗洞与桌面关系', src: `${apartment}/process/gaming-white-model.png` },
      after: { title: '电竞房 AI 效果图', meta: '木质柜体、工作区与陈列细节', src: `${apartment}/renders/render-03.jpeg` },
    },
  ],
}

export const familyHomeDiagrams = [
  { title: '彩色平面图', meta: '客餐厅、卧室与工作空间的整体布局', src: `${family}/diagrams/floor-plan.jpeg` },
  { title: '功能分区', meta: '公共、休闲、主卧、次卧与私密空间', src: `${family}/diagrams/zoning.jpeg` },
  { title: '动线分析', meta: '主要通行与次要通行的空间联系', src: `${family}/diagrams/circulation.jpeg` },
  { title: '轴测分析', meta: '从立体视角理解房间关系与家具布置', src: `${family}/diagrams/axonometric.jpeg` },
  { title: '客厅材料分析', meta: '沙发、茶几、地毯与灯具的材质搭配', src: `${family}/diagrams/living-materials.jpeg` },
  { title: '餐厨材料分析', meta: '岛台、柜体、台面与吊灯的拆解表达', src: `${family}/diagrams/kitchen-materials.jpeg` },
  { title: '卧室材料分析', meta: '木作、织物与床头界面的组合', src: `${family}/diagrams/bedroom-materials.jpg` },
  { title: '直播间材料分析', meta: '工作台、展示层架与背景材料', src: `${family}/diagrams/studio-materials.jpeg` },
  { title: '卫生间材料分析', meta: '石材、玻璃、金属与照明的节点搭配', src: `${family}/diagrams/bathroom-materials.jpeg` },
]

export const familyHomePresentationBoards = [
  { title: '三口之家 · 方案展板', meta: '空间效果、设计说明、平面与材料分析汇总', src: `${family}/boards/presentation.jpg` },
]
