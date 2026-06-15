'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/* ── LINE 設定（換成你的真實 ID 即可）── */
const LINE_ID = '@loverbay'                            // ← 之後換成你的 LINE ID
const LINE_URL = `https://line.me/ti/p/${encodeURIComponent(LINE_ID)}`

/* ══════════════════════════════════════════
   翻譯字典
══════════════════════════════════════════ */
type Lang = 'zh' | 'en' | 'ja' | 'ko'

const T: Record<Lang, Record<string, string>> = {
  zh: {
    'nav.about': '品牌介紹', 'nav.spaces': '空間導覽', 'nav.pricing': '包場價',
    'nav.booking': '預約', 'nav.transport': '交通',
    'hero.eyebrow': '宜蘭海岸第一排 · 一次只接待一組VIP貴賓',
    'hero.title': '灣灣拾光',
    'hero.sub': '在最靠近海浪的地方，收藏屬於你們的時光',
    'hero.book': '立即洽詢包場', 'hero.line': '加入 LINE 聯繫', 'hero.scroll': '向下探索',
    'about.title': '全棟獨享，用海景留住每一個值得珍藏的瞬間',
    'about.desc': '灣灣拾光坐落於宜蘭海岸第一排，是一處專為特別時刻設計的私密包場空間。一次只接待一組貴賓，無論是家族聚會、情侶紀念日或閨蜜小旅行，整棟空間完全屬於你們，感受遼闊海景與絕對隱私。',
    'f1.t': '絕美海景', 'f1.d': '宜蘭海岸第一排，無遮蔽全景視野',
    'f2.t': '完全獨享', 'f2.d': '一次只接待一組，整棟全程屬於你',
    'f3.t': '全棟專屬包場', 'f3.d': '整棟獨享，從入場到歸還全程專屬',
    'f4.t': '貼心服務', 'f4.d': '24 小時內確認預約，即時 LINE 回覆',
    'gallery.title': '空間實景',
    'space.title': '一次只接待一組，您的專屬包場',
    'space.desc': '灣灣拾光採全棟空間包場制。全棟空間完全屬於您這組貴賓，不與任何人共享。',
    'space.badge': 'VIP 獨享 · 唯一方案',
    'space.name': '全棟空間租賃', 'space.cta': '立即洽詢包場',
    'space.sdesc': '整棟獨享，含海景獨立休憩空間、中島廚房、多功能交誼廳、戶外平台，全程無其他賓客',
    'space.pax': '人數：', 'space.pax.v': '2–10 人',
    'space.period': '時段：', 'space.period.v': '單日專屬包場',
    'space.hint': '平日起',
    'a1': '海景休憩空間', 'a2': '全套廚房', 'a3': '戶外平台',
    'a4': '停車位', 'a5': 'Wi-Fi', 'a6': '獨立衛浴',
    'pricing.title': '透明費率，無隱藏收費',
    'pricing.desc': '所有價格皆含全棟空間使用費，詳細金額請填寫預約表單或聯繫 LINE 確認。',
    'p.weekday': '平日', 'p.weekday.sub': '週日至週四', 'p.weekday.note': '最優惠費率，建議彈性安排行程選平日',
    'p.badge': '最多人選擇',
    'p.weekend': '假日', 'p.weekend.sub': '週五、週六', 'p.weekend.note': '假日需求高，建議提前 2 週以上預訂',
    'p.holiday': '連續假期', 'p.holiday.sub': '各大連假期間', 'p.holiday.note': '各連假費率略有不同，詳見下方說明',
    'p.day': '/日',
    'sr.type': '連假類型', 'sr.period': '期間', 'sr.note': '特別說明',
    'sr.r1': '端午節連假', 'sr.r1p': '端午連假期間', 'sr.r1n': '需全程付款',
    'sr.r2': '中秋節連假', 'sr.r2p': '中秋連假期間', 'sr.r2n': '限 3 天起訂',
    'sr.r3': '聖誕 / 元旦', 'sr.r3p': '12/24 – 1/1', 'sr.r3n': '特別裝飾可加購',
    'sr.r4': '農曆新年', 'sr.r4p': '除夕至初六', 'sr.r4n': '需提前 2 個月預訂',
    'cal.title': '專屬包場預約',
    'cal.desc': '行事曆即時更新，綠色為可預約、紅色為已訂滿。',
    'cal.ph': 'Google 日曆嵌入（上線後顯示）',
    'cal.a': '可預約', 'cal.f': '已訂滿', 'cal.p': '審核中',
    'book.title': '填寫預約表單',
    'book.desc': '填寫後我們將於 24 小時內確認並回覆，也可直接加 LINE 取得更即時的回覆。',
    'f.name': '姓名', 'f.name.ph': '請輸入您的姓名',
    'f.phone': '聯絡電話',
    'f.email': '電子信箱',
    'f.plan': '預約方案',
    'f.plan.v': '全棟空間租賃（VIP 專屬包場）',
    'f.in': '入場時間', 'f.out': '歸還時間',
    'f.guests': '入場人數', 'f.guests.ph': '請輸入人數',
    'f.source': '如何得知我們', 'f.source.ph': '-- 請選擇 --',
    'f.ig': 'Instagram', 'f.fb': 'Facebook', 'f.friend': '朋友推薦', 'f.google': 'Google 搜尋',
    'f.notes': '特殊需求', 'f.notes.ph': '例如：生日佈置、寵物同行、嬰兒床等...',
    'f.submit': '送出預約申請',
    'f.note': '送出後我們將於 24 小時內回覆確認信 · 如需即時回覆請直接加 LINE 聯繫',
    'spots.title': '周邊景點推薦',
    'spots.desc': '住在這裡，宜蘭最美的風景都在咫尺之間。',
    's1.n': '南方澳漁港', 's1.d': '全台最大近海漁港，現撈海鮮直送、漁船雲集，最道地的海味體驗', 's1.dist': '約 5 分鐘車程',
    's2.n': '蘇澳冷泉', 's2.d': '全球罕見天然碳酸冷泉，清涼消暑又養顏美容，夏日必訪', 's2.dist': '約 5 分鐘車程',
    's3.n': '豆腐岬', 's3.d': '清澈碧藍的浮潛秘境，珊瑚礁魚群悠游，夏日玩水首選', 's3.dist': '約 10 分鐘車程',
    's4.n': '外澳衝浪灘', 's4.d': '宜蘭最知名衝浪勝地，浪花拍打、遠眺龜山島美景', 's4.dist': '約 20 分鐘車程',
    's5.n': '礁溪溫泉', 's5.d': '全台少見平地溫泉，露天泡湯放鬆身心的最佳選擇', 's5.dist': '約 30 分鐘車程',
    's6.n': '羅東夜市', 's6.d': '宜蘭夜間美食天堂，臭豆腐、蔥油餅、烤鴨應有盡有', 's6.dist': '約 25 分鐘車程',
    's7.n': '南方澳觀景台', 's7.d': '居高臨下俯瞰南方澳漁港與太平洋，夕陽時分景色醉人，是南方澳必訪打卡點', 's7.dist': '約 10 分鐘步行',
    's8.n': '七星嶺步道', 's8.d': '蘇澳最美健行步道，沿途七個觀景平台可遠眺龜山島、蘭陽平原與太平洋', 's8.dist': '約 10 分鐘車程',
    'tr.title': '怎麼來找我們',
    't1.n': '自駕', 't1.d': '走國道 5 號至終點「蘇澳交流道」下，循台9丙線往南方澳方向，過跨海大橋後依 Google Maps 導航「情人灣停車場」即可抵達。提供免費停車位。',
    't2.n': '火車 + 公車', 't2.d': '搭乘台鐵至「蘇澳新站」，再步行約15分鐘；或於車站轉乘宜蘭公車【綠28】（蘇澳─南方澳環線），於「南方澳大橋」站下車步行約5分鐘即可抵達。票價：現金20元／悠遊卡15元，約每20–30分鐘一班。',
    't3.n': '長途客運', 't3.d': '從台北可搭國光客運（1879線）直達南方澳站；或搭葛瑪蘭客運、首都客運至「蘇澳轉運站」，再轉乘【綠28】公車約10分鐘即可抵達。',
    't4.n': '包車 / 接送', 't4.d': '如需包車或接送服務，歡迎透過 LINE 詢問合作車行聯繫方式，我們協助安排。',
    'bus.title': '附近公車資訊',
    'bus.nearest': '最近站牌', 'bus.walk': '步行約 5 分鐘',
    'bus.fare': '票價', 'bus.freq': '班距', 'bus.op': '業者',
    'map.ph': 'Google Maps 嵌入地圖（上線後顯示）',
    'line.book.title': '更快速！直接加 LINE 預約',
    'line.book.desc': '加入我們的 LINE，即時詢問空閒日期、報價，或直接完成預約。',
    'line.book.btn': '立即加入 LINE 預約',
    'line.book.id': 'LINE ID：',
    'line.or': '或',
    'ft.desc': '宜蘭海岸第一排的私密包場空間，讓每一個到訪的時光都值得被珍藏。',
    'ft.addr': '📍 宜蘭縣蘇澳鎮造船路102號',
    'ft.tel': '請洽 LINE',
    'ft.nav': '快速導覽', 'ft.contact': '聯絡我們',
    'ft.privacy': '隱私權政策', 'ft.line.acc': 'LINE 官方帳號',
    'ft.copy': '© 2026 灣灣拾光 Loverbay Moment Space. All rights reserved.',
    'float.label': '加入 LINE 即時詢問',
  },
  en: {
    'nav.about': 'About', 'nav.spaces': 'Spaces', 'nav.pricing': 'Pricing',
    'nav.booking': 'Book', 'nav.transport': 'Access',
    'hero.eyebrow': 'Yilan Oceanfront · One Exclusive Group at a Time',
    'hero.title': 'Loverbay Moment Space',
    'hero.sub': 'Collect your most precious moments closest to the waves.',
    'hero.book': 'Book Now', 'hero.line': 'Contact on LINE', 'hero.scroll': 'Scroll to Explore',
    'about.title': 'Your Entire Private Retreat — Ocean Views, Zero Compromise',
    'about.desc': 'Loverbay Moment Space sits on Yilan\'s first-row beachfront, designed for intimate gatherings and special occasions. We host one VIP group at a time — the entire property is yours. Whether it\'s a family trip, anniversary, or friends\' getaway, step back and breathe in the endless ocean.',
    'f1.t': 'Ocean View', 'f1.d': 'First-row beachfront, unobstructed panoramic sea view',
    'f2.t': 'Fully Exclusive', 'f2.d': 'One group only — the entire property is yours',
    'f3.t': 'Exclusive Venue Rental', 'f3.d': 'The whole space is yours from entry to departure',
    'f4.t': 'Caring Service', 'f4.d': 'Confirmed within 24 hrs, instant LINE replies',
    'gallery.title': 'Our Space',
    'space.title': 'One Group Only — Your Exclusive Retreat',
    'space.desc': 'Loverbay accepts one VIP group at a time. The entire property is yours — no other guests, ever.',
    'space.badge': 'VIP Exclusive · Only Option',
    'space.name': 'Exclusive Venue Rental', 'space.cta': 'Reserve Now',
    'space.sdesc': 'Entire property — ocean lounge, kitchen, multi-function hall & outdoor deck. No other guests on-site.',
    'space.pax': 'Guests: ', 'space.pax.v': '2–10',
    'space.period': 'Duration: ', 'space.period.v': 'Single-Day Exclusive Booking',
    'space.hint': 'From weekday rate',
    'a1': 'Ocean Lounge', 'a2': 'Full Kitchen', 'a3': 'Outdoor Deck',
    'a4': 'Parking', 'a5': 'Wi-Fi', 'a6': 'Private Bath',
    'pricing.title': 'Transparent Pricing, No Hidden Fees',
    'pricing.desc': 'All prices include full use of the property. Contact us via LINE for exact rates.',
    'p.weekday': 'Weekday', 'p.weekday.sub': 'Sun – Thu', 'p.weekday.note': 'Best rates — great if you\'re flexible with dates',
    'p.badge': 'Most Popular',
    'p.weekend': 'Weekend', 'p.weekend.sub': 'Fri & Sat', 'p.weekend.note': 'High demand — book at least 2 weeks in advance',
    'p.holiday': 'Long Holiday', 'p.holiday.sub': 'Public holiday periods', 'p.holiday.note': 'Rates vary by holiday — see details below',
    'p.day': '/night',
    'sr.type': 'Holiday', 'sr.period': 'Period', 'sr.note': 'Notes',
    'sr.r1': 'Dragon Boat Festival', 'sr.r1p': 'Holiday period', 'sr.r1n': 'Full payment required',
    'sr.r2': 'Mid-Autumn Festival', 'sr.r2p': 'Holiday period', 'sr.r2n': 'Min. 3-night stay',
    'sr.r3': 'Christmas / New Year', 'sr.r3p': '12/24 – 1/1', 'sr.r3n': 'Special décor add-on available',
    'sr.r4': 'Lunar New Year', 'sr.r4p': 'New Year\'s Eve – 6th day', 'sr.r4n': 'Book 2 months in advance',
    'cal.title': 'Check Real-Time Availability',
    'cal.desc': 'Calendar updated live — green: available, red: fully booked.',
    'cal.ph': 'Google Calendar embed (live after launch)',
    'cal.a': 'Available', 'cal.f': 'Fully Booked', 'cal.p': 'Pending',
    'book.title': 'Reservation Form',
    'book.desc': 'We\'ll confirm within 24 hours. Or contact us directly on LINE for faster replies.',
    'f.name': 'Name', 'f.name.ph': 'Your full name',
    'f.phone': 'Phone',
    'f.email': 'Email',
    'f.plan': 'Package',
    'f.plan.v': 'Exclusive Venue Rental (VIP Only)',
    'f.in': 'Check-in Date', 'f.out': 'Check-out Date',
    'f.guests': 'Number of Guests', 'f.guests.ph': 'Enter number of guests',
    'f.source': 'How did you find us', 'f.source.ph': '-- Select --',
    'f.ig': 'Instagram', 'f.fb': 'Facebook', 'f.friend': 'Friend Referral', 'f.google': 'Google',
    'f.notes': 'Special Requests', 'f.notes.ph': 'e.g. Birthday decoration, pets, baby cot...',
    'f.submit': 'Submit Reservation',
    'f.note': 'We\'ll reply within 24 hrs · For instant replies, contact us on LINE',
    'spots.title': 'Nearby Attractions',
    'spots.desc': 'The best of Yilan is just minutes away.',
    's1.n': 'Nanfangao Fishing Port', 's1.d': 'Taiwan\'s largest inshore fishing port — ultra-fresh seafood right off the boat', 's1.dist': '~5 min drive',
    's2.n': 'Suao Cold Spring', 's2.d': 'One of the world\'s rarest natural carbonated cold springs, great for skin', 's2.dist': '~5 min drive',
    's3.n': 'Doufu Cape', 's3.d': 'Crystal-clear snorkeling cove with colorful coral reef fish', 's3.dist': '~10 min drive',
    's4.n': 'Waiao Surf Beach', 's4.d': 'Yilan\'s top surf spot with a stunning view of Guishan Island', 's4.dist': '~20 min drive',
    's5.n': 'Jiaoxi Hot Springs', 's5.d': 'Rare flatland hot springs — perfect for unwinding after a day out', 's5.dist': '~30 min drive',
    's6.n': 'Luodong Night Market', 's6.d': 'Yilan\'s most famous night market packed with street food delights', 's6.dist': '~25 min drive',
    's7.n': 'Nanfang\'ao Observation Deck', 's7.d': 'Panoramic overlook of the fishing port and Pacific Ocean — magical at golden hour', 's7.dist': '~10 min walk',
    's8.n': 'Qixingling Hiking Trail', 's8.d': 'Seven scenic platforms with sweeping views of Guishan Island, Lanyang Plain, and the ocean', 's8.dist': '~10 min drive',
    'tr.title': 'Getting Here',
    't1.n': 'Self-Drive', 't1.d': 'Take National Freeway 5 to the last exit "Suao Interchange", follow Rt. 9C toward Nanfang\'ao, cross the Nanfang\'ao Bridge, then navigate to "情人灣停車場 (Lovers Bay Parking)". Free parking available.',
    't2.n': 'Train + Bus', 't2.d': 'Take TRA to "Suao New Station", then walk ~15 min or transfer to Green Route 28 bus (Suao–Nanfang\'ao loop) and alight at "Nanfang\'ao Bridge" stop (~5 min walk). Fare: NT$20 cash / NT$15 EasyCard. Buses run every 20–30 min.',
    't3.n': 'Long-Distance Bus', 't3.d': 'From Taipei, take Kuokuang Bus (Route 1879) directly to Nanfang\'ao. Or take Kamalan/Capital Bus to "Suao Transfer Station", then transfer to Green 28 bus (~10 min ride).',
    't4.n': 'Charter / Pickup', 't4.d': 'Need a ride? Message us on LINE and we\'ll help arrange a driver.',
    'bus.title': 'Nearby Bus Routes',
    'bus.nearest': 'Nearest Stop', 'bus.walk': '~5 min walk',
    'bus.fare': 'Fare', 'bus.freq': 'Frequency', 'bus.op': 'Operator',
    'map.ph': 'Google Maps embed (live after launch)',
    'line.book.title': 'Faster! Book Directly via LINE',
    'line.book.desc': 'Add our LINE to check availability, get a quote, or book instantly.',
    'line.book.btn': 'Add LINE to Book Now',
    'line.book.id': 'LINE ID: ',
    'line.or': 'or',
    'ft.desc': 'A private oceanfront retreat on Yilan\'s first-row beachfront — where every visit becomes a memory worth keeping.',
    'ft.addr': '📍 No.102, Zaochuan Rd., Su-ao, Yilan County',
    'ft.tel': 'Contact via LINE',
    'ft.nav': 'Quick Links', 'ft.contact': 'Contact Us',
    'ft.privacy': 'Privacy Policy', 'ft.line.acc': 'LINE Official Account',
    'ft.copy': '© 2026 Loverbay Moment Space. All rights reserved.',
    'float.label': 'Contact on LINE',
  },
  ja: {
    'nav.about': 'ブランド紹介', 'nav.spaces': 'スペース', 'nav.pricing': '料金',
    'nav.booking': '予約', 'nav.transport': 'アクセス',
    'hero.eyebrow': '宜蘭海岸最前列 · 一組限定のVIP専用空間',
    'hero.title': 'Loverbay Moment Space',
    'hero.sub': '波に最も近い場所で、大切な瞬間を刻む。',
    'hero.book': '今すぐ予約', 'hero.line': 'LINEで問い合わせ', 'hero.scroll': 'スクロールして探索',
    'about.title': '施設全体を独占、海を背景に大切な瞬間を永遠に',
    'about.desc': 'Loverbay Moment Spaceは宜蘭海岸最前列に位置し、特別な時間のために設計されたプライベート専用空間です。一度に一組のVIPゲストのみをお迎えします。家族旅行、記念日、女子旅など、施設全体があなただけのもの。',
    'f1.t': '絶景の海', 'f1.d': '宜蘭海岸最前列、遮るもののない絶景パノラマ',
    'f2.t': '完全独占', 'f2.d': '一組限定 — 施設全体があなただけのもの',
    'f3.t': '終日専用会場レンタル', 'f3.d': '入場から退場まで会場全体を独占',
    'f4.t': '丁寧なサービス', 'f4.d': '24時間以内に予約確認、LINEで即座に返信対応',
    'gallery.title': '空間ギャラリー',
    'space.title': '一組限定 — あなただけの完全貸切',
    'space.desc': 'Loverbayは一度に一組のVIPゲストのみをお迎えします。施設全体があなただけのものです。',
    'space.badge': 'VIP限定 · 唯一のプラン',
    'space.name': '会場まるごとレンタル', 'space.cta': '今すぐ予約',
    'space.sdesc': '海景休憩スペース・キッチン・多目的ラウンジ・アウトドアデッキを含む一棟独占。他のゲストは一切いません。',
    'space.pax': '人数：', 'space.pax.v': '2〜10名',
    'space.period': '時間：', 'space.period.v': '一日専用貸切',
    'space.hint': '平日料金から',
    'a1': 'オーシャンビュー休憩室', 'a2': 'フルキッチン', 'a3': 'アウトドアデッキ',
    'a4': '駐車場', 'a5': 'Wi-Fi', 'a6': '専用バスルーム',
    'pricing.title': '明確な料金設定、隠れた費用なし',
    'pricing.desc': '全ての料金にスペース使用料が含まれます。詳細はLINEにてご確認ください。',
    'p.weekday': '平日', 'p.weekday.sub': '日〜木曜日', 'p.weekday.note': '最もお得な料金。日程に余裕がある方にお勧めです',
    'p.badge': '最も人気',
    'p.weekend': '週末', 'p.weekend.sub': '金・土曜日', 'p.weekend.note': '需要が高いため、2週間以上前のご予約をお勧めします',
    'p.holiday': '連休', 'p.holiday.sub': '各連休期間中', 'p.holiday.note': '連休ごとに料金が異なります。下記をご参照ください',
    'p.day': '/泊',
    'sr.type': '連休の種類', 'sr.period': '期間', 'sr.note': '備考',
    'sr.r1': '端午節連休', 'sr.r1p': '端午節連休期間', 'sr.r1n': '全額お支払い必須',
    'sr.r2': '中秋節連休', 'sr.r2p': '中秋節連休期間', 'sr.r2n': '最低3泊から',
    'sr.r3': 'クリスマス / 元旦', 'sr.r3p': '12/24 – 1/1', 'sr.r3n': '特別デコレーション追加オプションあり',
    'sr.r4': '旧正月', 'sr.r4p': '大晦日〜6日目', 'sr.r4n': '2ヶ月前までにご予約ください',
    'cal.title': 'リアルタイム空き状況確認',
    'cal.desc': 'カレンダーは常時更新。緑：予約可、赤：満室。',
    'cal.ph': 'Googleカレンダー埋め込み（公開後に表示）',
    'cal.a': '予約可能', 'cal.f': '満室', 'cal.p': '確認中',
    'book.title': '予約フォーム',
    'book.desc': '送信後24時間以内にご連絡します。お急ぎの場合はLINEで直接お問い合わせください。',
    'f.name': 'お名前', 'f.name.ph': 'お名前をご入力ください',
    'f.phone': '電話番号',
    'f.email': 'メールアドレス',
    'f.plan': 'プラン',
    'f.plan.v': '会場まるごとレンタル（VIP限定）',
    'f.in': 'チェックイン日', 'f.out': 'チェックアウト日',
    'f.guests': '人数', 'f.guests.ph': '人数を入力してください',
    'f.source': 'どこで知りましたか', 'f.source.ph': '-- 選択してください --',
    'f.ig': 'Instagram', 'f.fb': 'Facebook', 'f.friend': '友人の紹介', 'f.google': 'Google',
    'f.notes': '特別なご要望', 'f.notes.ph': '例：誕生日の飾り付け、ペット同伴、ベビーベッドなど...',
    'f.submit': '予約を送信する',
    'f.note': '送信後24時間以内にご返信します · 即時返信はLINEへ',
    'spots.title': '周辺観光スポット',
    'spots.desc': '宜蘭の美しい景色がすぐそこに。',
    's1.n': '南方澳漁港', 's1.d': '台湾最大の近海漁港、水揚げ直送の新鮮な魚介類が楽しめます', 's1.dist': '車で約5分',
    's2.n': '蘇澳冷泉', 's2.d': '世界でも珍しい天然炭酸冷泉、肌に優しく夏にぴったり', 's2.dist': '車で約5分',
    's3.n': '豆腐岬', 's3.d': '透明度の高いシュノーケリングスポット、カラフルな熱帯魚に出会えます', 's3.dist': '車で約10分',
    's4.n': '外澳サーフビーチ', 's4.d': '宜蘭で最も人気のサーフスポット、亀山島の絶景も楽しめます', 's4.dist': '車で約20分',
    's5.n': '礁渓温泉', 's5.d': '平地では珍しい温泉地、露天風呂でゆったりリフレッシュ', 's5.dist': '車で約30分',
    's6.n': '羅東ナイトマーケット', 's6.d': '宜蘭を代表するナイトマーケット、地元グルメが勢ぞろい', 's6.dist': '車で約25分',
    's7.n': '南方澳展望台', 's7.d': '漁港と太平洋を一望できる展望台。夕暮れ時は息をのむ絶景が広がります', 's7.dist': '徒歩約10分',
    's8.n': '七星嶺ハイキングコース', 's8.d': '7つの展望スポットから亀山島・蘭陽平原・太平洋を見渡す蘇澳随一のトレイル', 's8.dist': '車で約10分',
    'tr.title': 'アクセス方法',
    't1.n': '自家用車', 't1.d': '国道5号の終点「蘇澳IC」を降り、台9丙線を南方澳方面へ。南方澳大橋を渡り「情人灣停車場」でナビ設定。無料駐車場完備。',
    't2.n': '電車 + バス', 't2.d': '台鉄「蘇澳新駅」下車後、徒歩約15分。またはグリーン28バス（蘇澳─南方澳環線）に乗り「南方澳大橋」停留所で下車（徒歩約5分）。運賃：現金20元／ICカード15元、約20〜30分間隔で運行。',
    't3.n': '長距離バス', 't3.d': '台北からは国光客運（1879線）で南方澳まで直行可能。またはカマラン客運・首都客運で「蘇澳転運站」下車後、グリーン28バスに乗り換え（約10分）。',
    't4.n': 'チャーター / 送迎', 't4.d': '送迎をご希望の場合はLINEにてご連絡ください。手配をお手伝いします。',
    'bus.title': '近くのバス路線',
    'bus.nearest': '最寄りバス停', 'bus.walk': '徒歩約5分',
    'bus.fare': '運賃', 'bus.freq': '運行間隔', 'bus.op': '運営会社',
    'map.ph': 'Google マップ埋め込み（公開後に表示）',
    'line.book.title': 'LINEで直接予約がもっと便利！',
    'line.book.desc': 'LINEを追加して、空き状況や料金をすぐに確認。そのまま予約も可能です。',
    'line.book.btn': 'LINEを追加して予約する',
    'line.book.id': 'LINE ID：',
    'line.or': 'または',
    'ft.desc': '宜蘭海岸最前列のプライベート貸切空間。すべての訪問が忘れられない思い出になります。',
    'ft.addr': '📍 宜蘭県蘇澳鎮造船路102号',
    'ft.tel': 'LINEでお問い合わせ',
    'ft.nav': 'クイックリンク', 'ft.contact': 'お問い合わせ',
    'ft.privacy': 'プライバシーポリシー', 'ft.line.acc': 'LINE公式アカウント',
    'ft.copy': '© 2026 Loverbay Moment Space. All rights reserved.',
    'float.label': 'LINEで問い合わせ',
  },
  ko: {
    'nav.about': '브랜드 소개', 'nav.spaces': '공간', 'nav.pricing': '요금',
    'nav.booking': '예약', 'nav.transport': '교통',
    'hero.eyebrow': '이란 해안 최전선 · 한 팀만을 위한 VIP 단독 공간',
    'hero.title': 'Loverbay Moment Space',
    'hero.sub': '파도에 가장 가까운 곳에서, 소중한 순간을 간직하세요.',
    'hero.book': '지금 예약하기', 'hero.line': 'LINE으로 문의', 'hero.scroll': '스크롤하여 탐색',
    'about.title': '공간 전체를 단독으로, 바다를 배경으로 소중한 순간을',
    'about.desc': 'Loverbay Moment Space는 이란 해안 최전선에 위치한 프라이빗 단독 공간입니다. 한 번에 한 팀의 VIP 손님만 받습니다. 가족 여행, 기념일, 친구 모임 등 공간 전체가 오직 당신의 것입니다.',
    'f1.t': '절경 오션뷰', 'f1.d': '이란 해안 최전선, 막힘없는 파노라마 전망',
    'f2.t': '완전 단독', 'f2.d': '한 팀만 — 공간 전체가 오직 당신의 것',
    'f3.t': '단독 공간 대관', 'f3.d': '입장부터 퇴장까지 공간 전체가 당신만의 것',
    'f4.t': '세심한 서비스', 'f4.d': '24시간 내 예약 확인, LINE 즉시 답변',
    'gallery.title': '공간 갤러리',
    'space.title': '한 팀만 — 당신만을 위한 단독 대관',
    'space.desc': 'Loverbay는 한 번에 한 팀의 VIP 손님만 받습니다. 공간 전체가 오직 당신의 것입니다.',
    'space.badge': 'VIP 단독 · 유일한 플랜',
    'space.name': '전체 공간 단독 대관', 'space.cta': '지금 예약',
    'space.sdesc': '해경 휴게 공간·주방·다목적 라운지·야외 데크 포함 전체 독점. 다른 손님은 없습니다.',
    'space.pax': '인원: ', 'space.pax.v': '2–10명',
    'space.period': '이용: ', 'space.period.v': '하루 종일 (전체 단독)',
    'space.hint': '평일 요금부터',
    'a1': '오션뷰 휴게 공간', 'a2': '풀 주방', 'a3': '야외 데크',
    'a4': '주차 공간', 'a5': 'Wi-Fi', 'a6': '단독 욕실',
    'pricing.title': '투명한 요금, 숨겨진 비용 없음',
    'pricing.desc': '모든 요금에 공간 이용료가 포함됩니다. 자세한 금액은 LINE으로 확인해 주세요.',
    'p.weekday': '평일', 'p.weekday.sub': '일 – 목요일', 'p.weekday.note': '가장 저렴한 요금. 일정이 유연하다면 평일을 추천합니다',
    'p.badge': '가장 많이 선택',
    'p.weekend': '주말', 'p.weekend.sub': '금·토요일', 'p.weekend.note': '수요가 높으니 최소 2주 전 예약을 권장합니다',
    'p.holiday': '연휴', 'p.holiday.sub': '주요 연휴 기간', 'p.holiday.note': '연휴마다 요금이 다릅니다. 아래 내용을 참고하세요',
    'p.day': '/박',
    'sr.type': '연휴 종류', 'sr.period': '기간', 'sr.note': '비고',
    'sr.r1': '단오절 연휴', 'sr.r1p': '단오절 연휴 기간', 'sr.r1n': '전액 결제 필요',
    'sr.r2': '중추절 연휴', 'sr.r2p': '중추절 연휴 기간', 'sr.r2n': '최소 3박 이상',
    'sr.r3': '크리스마스 / 신정', 'sr.r3p': '12/24 – 1/1', 'sr.r3n': '특별 데코레이션 추가 가능',
    'sr.r4': '구정 연휴', 'sr.r4p': '섣달 그믐 – 6일째', 'sr.r4n': '2개월 전 예약 필수',
    'cal.title': '실시간 예약 가능 날짜 확인',
    'cal.desc': '캘린더 실시간 업데이트 — 초록: 예약 가능, 빨강: 마감.',
    'cal.ph': 'Google 캘린더 삽입 (오픈 후 표시)',
    'cal.a': '예약 가능', 'cal.f': '예약 마감', 'cal.p': '검토 중',
    'book.title': '예약 양식',
    'book.desc': '제출 후 24시간 내에 답변드립니다. 빠른 답변을 원하시면 LINE으로 직접 문의해 주세요.',
    'f.name': '이름', 'f.name.ph': '이름을 입력해 주세요',
    'f.phone': '연락처',
    'f.email': '이메일',
    'f.plan': '플랜',
    'f.plan.v': '하루 단독 대관 (VIP 전용)',
    'f.in': '체크인 날짜', 'f.out': '체크아웃 날짜',
    'f.guests': '인원 수', 'f.guests.ph': '인원 수를 입력해 주세요',
    'f.source': '어떻게 알게 되셨나요', 'f.source.ph': '-- 선택해 주세요 --',
    'f.ig': 'Instagram', 'f.fb': 'Facebook', 'f.friend': '지인 추천', 'f.google': 'Google',
    'f.notes': '특별 요청사항', 'f.notes.ph': '예: 생일 장식, 반려동물 동반, 유아 침대 등...',
    'f.submit': '예약 신청 제출',
    'f.note': '제출 후 24시간 내 확인 이메일을 드립니다 · 즉시 답변은 LINE으로 연락해 주세요',
    'spots.title': '주변 관광 명소',
    'spots.desc': '이란 최고의 풍경이 바로 코앞에 있습니다.',
    's1.n': '난팡아오 어항', 's1.d': '대만 최대 근해 어항, 갓 잡은 신선한 해산물을 맛볼 수 있는 곳', 's1.dist': '차로 약 5분',
    's2.n': '쑤아오 냉천', 's2.d': '세계적으로 희귀한 천연 탄산 냉천, 피부 미용과 피로 회복에 효과적', 's2.dist': '차로 약 5분',
    's3.n': '더우푸자 (두부곶)', 's3.d': '산호초와 열대어가 가득한 투명한 스노클링 명소', 's3.dist': '차로 약 10분',
    's4.n': '와이아오 서핑 해변', 's4.d': '이란 최고의 서핑 명소, 구이산섬 전망이 아름다운 해변', 's4.dist': '차로 약 20분',
    's5.n': '자오시 온천', 's5.d': '대만에서 보기 드문 평지 온천, 야외 탕에서 여유롭게 휴식', 's5.dist': '차로 약 30분',
    's6.n': '뤄둥 야시장', 's6.d': '이란 최대 야시장, 현지 길거리 음식이 가득한 미식 천국', 's6.dist': '차로 약 25분',
    's7.n': '난팡아오 전망대', 's7.d': '어항과 태평양을 내려다보는 전망대. 황금빛 석양이 물드는 시간이 특히 아름답습니다', 's7.dist': '도보 약 10분',
    's8.n': '치싱링 하이킹 코스', 's8.d': '7개의 전망 포인트에서 구이산섬, 란양평원, 태평양을 한눈에 볼 수 있는 쑤아오 최고의 트레일', 's8.dist': '차로 약 10분',
    'tr.title': '오시는 방법',
    't1.n': '자가용', 't1.d': '국도 5호선 종점 「쑤아오 IC」에서 내려 대만 9丙선을 따라 난팡아오 방면으로 진행. 난팡아오 대교를 건너 「情人灣停車場」으로 내비게이션. 무료 주차 가능.',
    't2.n': '기차 + 버스', 't2.d': '대만철도 「쑤아오 신역」 하차 후 도보 약 15분. 또는 그린 28번 버스（쑤아오─난팡아오 순환선）로 「난팡아오 대교」 정류장 하차 후 도보 약 5분. 요금: 현금 20위안 / 교통카드 15위안, 약 20~30분 간격 운행.',
    't3.n': '장거리 버스', 't3.d': '타이베이에서 국광버스（1879번）로 난팡아오 직행 가능. 또는 까마란·수도버스로 「쑤아오 환승터미널」 하차 후 그린 28번 버스 환승（약 10분）.',
    't4.n': '전세 차량 / 픽업', 't4.d': '픽업 서비스가 필요하시면 LINE으로 문의해 주세요. 차량 수배를 도와드립니다.',
    'bus.title': '근처 버스 노선',
    'bus.nearest': '가장 가까운 정류장', 'bus.walk': '도보 약 5분',
    'bus.fare': '요금', 'bus.freq': '배차 간격', 'bus.op': '운영사',
    'map.ph': 'Google 지도 삽입 (오픈 후 표시)',
    'line.book.title': '더 빠르게! LINE으로 바로 예약',
    'line.book.desc': 'LINE을 추가하면 빈 날짜 확인, 요금 문의, 예약까지 바로 가능합니다.',
    'line.book.btn': 'LINE 추가하고 예약하기',
    'line.book.id': 'LINE ID: ',
    'line.or': '또는',
    'ft.desc': '이란 해안 최전선의 프라이빗 단독 공간 — 모든 방문이 소중한 추억이 되는 곳.',
    'ft.addr': '📍 이란현 쑤아오진 자오촨로 102호',
    'ft.tel': 'LINE으로 문의',
    'ft.nav': '빠른 링크', 'ft.contact': '문의하기',
    'ft.privacy': '개인정보 처리방침', 'ft.line.acc': 'LINE 공식 계정',
    'ft.copy': '© 2026 Loverbay Moment Space. All rights reserved.',
    'float.label': 'LINE으로 문의',
  },
}

/* ══════════════════════════════════════════
   사진 목록
══════════════════════════════════════════ */
const GALLERY = [
  { src: `${BASE}/photos/aerial-coast.webp`,  alt: '海岸全景',   label: 'gallery.label1',  cls: 'gallery-big' },
  { src: `${BASE}/photos/balcony-night.webp`, alt: '海風慢活露台', label: 'gallery.label2',  cls: '' },
  { src: `${BASE}/photos/balcony-4.jpg`,      alt: '戶外陽台',   label: 'gallery.label3',  cls: 'gallery-wide' },
  { src: `${BASE}/photos/seaview-living.jpg`, alt: '海景客廳',   label: 'gallery.label4',  cls: '' },
  { src: `${BASE}/photos/seaview-bed.webp`,   alt: '海景臥室',   label: 'gallery.label5',  cls: '' },
  { src: `${BASE}/photos/kitchen.jpg`,        alt: '全套廚房',   label: 'gallery.label6',  cls: '' },
  { src: `${BASE}/photos/room-twin.jpg`,      alt: '四人房',     label: 'gallery.label7',  cls: '' },
  { src: `${BASE}/photos/room-double.jpg`,    alt: '雙人房',     label: 'gallery.label8',  cls: '' },
  { src: `${BASE}/photos/bathroom.jpg`,       alt: '衛浴空間',   label: 'gallery.label9',  cls: '' },
  { src: `${BASE}/photos/room-single.webp`,   alt: '單人房',     label: 'gallery.label10', cls: '' },
]
const GALLERY_LABELS: Record<Lang, Record<string, string>> = {
  zh: { 'gallery.label1': '海岸全景', 'gallery.label2': '海風慢活露台', 'gallery.label3': '海風慢活露台', 'gallery.label4': '交流交誼廳', 'gallery.label5': '三樓·全景聽海舒壓空間', 'gallery.label6': '二樓·多功能共享中島空間', 'gallery.label7': '一樓·獨立休憩空間', 'gallery.label8': '一樓·獨立休憩空間', 'gallery.label9': '獨立衛浴空間', 'gallery.label10': '二樓·獨立休憩空間' },
  en: { 'gallery.label1': 'Coastal Panorama', 'gallery.label2': 'Ocean Breeze Terrace', 'gallery.label3': 'Ocean Breeze Terrace', 'gallery.label4': 'Social Lounge', 'gallery.label5': '3F · Panoramic Seaview Space', 'gallery.label6': '2F · Shared Island Kitchen', 'gallery.label7': '1F · Independent Retreat', 'gallery.label8': '1F · Independent Retreat', 'gallery.label9': 'Private Bath Suite', 'gallery.label10': '2F · Independent Retreat' },
  ja: { 'gallery.label1': '海岸パノラマ', 'gallery.label2': '潮風テラス', 'gallery.label3': '潮風テラス', 'gallery.label4': 'ラウンジスペース', 'gallery.label5': '3F・全景シービュースペース', 'gallery.label6': '2F・共有アイランドキッチン', 'gallery.label7': '1F・独立休憩エリア', 'gallery.label8': '1F・独立休憩エリア', 'gallery.label9': 'プライベートバス', 'gallery.label10': '2F・独立休憩エリア' },
  ko: { 'gallery.label1': '해안 파노라마', 'gallery.label2': '해풍 테라스', 'gallery.label3': '해풍 테라스', 'gallery.label4': '교류 라운지', 'gallery.label5': '3F·파노라마 오션뷰 공간', 'gallery.label6': '2F·공유 아일랜드 키친', 'gallery.label7': '1F·독립 휴식 공간', 'gallery.label8': '1F·독립 휴식 공간', 'gallery.label9': '전용 욕실 공간', 'gallery.label10': '2F·독립 휴식 공간' },
}

/* ══════════════════════════════════════════
   메인 컴포넌트
══════════════════════════════════════════ */
export default function Home() {
  const [lang, setLang] = useState<Lang>('zh')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const t = (key: string) => T[lang][key] ?? key
  const gl = (key: string) => GALLERY_LABELS[lang][key] ?? key

  const LANGS: { code: Lang; label: string }[] = [
    { code: 'zh', label: '中' },
    { code: 'en', label: 'EN' },
    { code: 'ja', label: '日' },
    { code: 'ko', label: '한' },
  ]

  return (
    <>
      {/* ── 導覽列 ── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-[5%] py-[18px] transition-all duration-300 ${scrolled ? 'nav-scrolled' : 'bg-transparent'}`}
      >
        <a href="#hero" className={`nav-logo font-bold text-lg tracking-wide no-underline ${scrolled ? 'text-[#0EA5E9]' : 'text-white'}`}>
          灣灣拾光
        </a>
        <ul className="hidden md:flex gap-6 list-none">
          {([
            { key: 'about', href: 'about' },
            { key: 'spaces', href: 'gallery' },
            { key: 'pricing', href: 'pricing' },
            { key: 'booking', href: 'booking' },
            { key: 'transport', href: 'transport' },
          ]).map(({ key, href }) => (
            <li key={key}>
              <a href={`#${href}`} className={`nav-link no-underline text-base transition-opacity hover:opacity-100 opacity-90 ${scrolled ? 'text-[#1A4A6E]' : 'text-white'}`}>
                {t(`nav.${key}`)}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          {LANGS.map(({ code, label }) => (
            <button
              key={code}
              onClick={() => setLang(code)}
              className={`lang-btn border rounded px-2.5 py-1 text-sm cursor-pointer transition-all ${
                lang === code
                  ? 'bg-[#F59E0B] border-[#F59E0B] text-white'
                  : scrolled
                    ? 'border-[#0EA5E9] text-[#0EA5E9] bg-transparent'
                    : 'border-white/60 text-white bg-transparent hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* ── 1. Hero ── */}
      <section id="hero" className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        {/* 真實海景照片背景 */}
        <Image
          src={`${BASE}/photos/hero-beach.jpg`}
          alt="灣灣拾光海景"
          fill
          priority
          className="object-cover object-center"
        />
        {/* 深色遮罩讓文字清晰可讀 */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,40,80,.45) 0%, rgba(0,60,120,.35) 50%, rgba(0,30,60,.6) 100%)' }} />
        <div className="relative z-10 text-white px-5">
          <p className="text-base tracking-[0.25em] uppercase mb-4" style={{ color: '#FFF3B0', textShadow: '0 1px 4px rgba(0,0,0,.2)' }}>
            {t('hero.eyebrow')}
          </p>
          <h1 className="font-black leading-tight mb-3" style={{ fontSize: 'clamp(2.4rem,6vw,4.8rem)', textShadow: '0 2px 12px rgba(0,80,150,.3)' }}>
            {t('hero.title')}<br />
            <span style={{ color: '#FFF3B0' }}>Loverbay Moment Space</span>
          </h1>
          <p className="mb-10 opacity-90 tracking-wide" style={{ fontSize: 'clamp(.95rem,2vw,1.2rem)', textShadow: '0 1px 4px rgba(0,0,0,.15)' }}>
            {t('hero.sub')}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="#booking" className="bg-white text-[#0EA5E9] font-bold px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-1 transition-transform text-base no-underline">
              {t('hero.book')}
            </a>
            <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="font-bold px-8 py-3.5 rounded-full shadow-lg hover:-translate-y-1 transition-transform text-base no-underline text-white" style={{ background: '#06C755' }}>
              {t('hero.line')}
            </a>
          </div>
        </div>
        <div className="scroll-arrow absolute left-1/2 bottom-8 text-white/60 text-xs tracking-widest text-center" style={{ width: '80px', marginLeft: '-40px' }}>
          {t('hero.scroll')}<br />↓
        </div>
      </section>

      {/* ── 2. 品牌介紹 ── */}
      <section id="about" className="py-24 px-[5%]">
        <p className="text-sm font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#0EA5E9' }}>About Us</p>
        <div className="grid md:grid-cols-2 gap-16 items-center mt-10">
          <div>
            <h2 className="font-black leading-snug mb-5" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: '#1E3A5F' }}>
              {t('about.title')}
            </h2>
            <p className="leading-relaxed mb-8" style={{ color: '#4A7FA5', fontSize: '1rem' }}>
              {t('about.desc')}
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🌊', t: 'f1.t', d: 'f1.d' },
                { icon: '🔒', t: 'f2.t', d: 'f2.d' },
                { icon: '🏠', t: 'f3.t', d: 'f3.d' },
                { icon: '💛', t: 'f4.t', d: 'f4.d' },
              ].map((f, i) => (
                <div key={i} className="feature-card bg-white rounded-lg p-5 shadow-sm">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <h4 className="font-bold text-base mb-1" style={{ color: '#1E3A5F' }}>{t(f.t)}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: '#4A7FA5' }}>{t(f.d)}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl h-96 relative">
            <Image src={`${BASE}/photos/balcony-2.webp`} alt="灣灣拾光海景" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* ── 3. 照片牆 ── */}
      <section id="gallery" className="py-24 px-[5%]" style={{ background: '#E0F2FE' }}>
        <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#0EA5E9' }}>Gallery</p>
        <h2 className="font-black mb-8" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: '#1E3A5F' }}>
          {t('gallery.title')}
        </h2>
        <div className="gallery-grid">
          {GALLERY.map((photo, i) => (
            <div key={i} className={`gallery-item ${photo.cls}`}>
              <Image src={photo.src} alt={photo.alt} fill sizes="(max-width:768px) 50vw, 25vw" className="gallery-img object-cover" />
              <span className="gallery-label">{gl(photo.label)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. 空間介紹 ── */}
      <section id="spaces" className="py-24 px-[5%]" style={{ background: '#FFF8EE' }}>
        <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#0EA5E9' }}>Our Space</p>
        <h2 className="font-black mb-3" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: '#1E3A5F' }}>
          {t('space.title')}
        </h2>
        <p className="mb-10 max-w-xl" style={{ color: '#4A7FA5' }}>{t('space.desc')}</p>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* 左欄：照片 */}
          <div className="relative rounded-2xl overflow-hidden shadow-lg" style={{ height: '460px' }}>
            <Image src={`${BASE}/photos/balcony-4.jpg`} alt="全棟空間租賃" fill className="object-cover" />
            <span className="absolute top-4 left-4 text-xs font-bold text-white px-3 py-1 rounded z-10" style={{ background: '#0EA5E9' }}>
              {t('space.badge')}
            </span>
          </div>
          {/* 右欄：文字內容 */}
          <div>
            <h3 className="font-black text-2xl mb-3" style={{ color: '#1E3A5F' }}>{t('space.name')}</h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#4A7FA5' }}>{t('space.sdesc')}</p>
            <div className="flex gap-6 mb-6 text-sm">
              <span style={{ color: '#4A7FA5' }}>{t('space.pax')}<strong style={{ color: '#0EA5E9' }}>{t('space.pax.v')}</strong></span>
              <span style={{ color: '#4A7FA5' }}>{t('space.period')}<strong style={{ color: '#0EA5E9' }}>{t('space.period.v')}</strong></span>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {['a1','a2','a3','a4','a5','a6'].map(a => (
                <span key={a} className="text-sm px-3 py-1.5 rounded-full font-medium" style={{ background: '#E0F2FE', color: '#1E3A5F' }}>{t(a)}</span>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <a href="#booking" className="font-bold text-sm text-white px-6 py-3 rounded-full no-underline hover:-translate-y-0.5 transition-transform" style={{ background: '#0EA5E9' }}>
                {t('space.cta')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. 價格方案 ── */}
      <section id="pricing" className="py-24 px-[5%]">
        <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#0EA5E9' }}>Pricing</p>
        <h2 className="font-black mb-3" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: '#1E3A5F' }}>{t('pricing.title')}</h2>
        <p className="mb-10 max-w-xl" style={{ color: '#4A7FA5' }}>{t('pricing.desc')}</p>
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            { type: 'WEEKDAY', k: 'p.weekday', sub: 'p.weekday.sub', note: 'p.weekday.note', featured: false },
            { type: 'WEEKEND', k: 'p.weekend', sub: 'p.weekend.sub', note: 'p.weekend.note', featured: true },
            { type: 'HOLIDAY', k: 'p.holiday', sub: 'p.holiday.sub', note: 'p.holiday.note', featured: false },
          ].map((card, i) => (
            <div key={i} className={`relative border rounded-xl p-8 text-center ${card.featured ? 'pricing-featured text-white' : 'border-gray-200'}`}>
              {card.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap" style={{ background: '#F59E0B' }}>
                  {t('p.badge')}
                </span>
              )}
              <p className="text-sm font-bold tracking-widest mb-2" style={{ color: card.featured ? '#FFF3B0' : '#0EA5E9' }}>{card.type}</p>
              <h3 className="text-xl font-black mb-1">{t(card.k)}</h3>
              <p className="text-base mb-6 opacity-70">{t(card.sub)}</p>
              <div className="text-4xl font-black mb-1" style={{ color: card.featured ? '#FFF3B0' : '#0EA5E9' }}>
                <sup className="text-lg">NT$</sup>●●●●<sub className="text-base opacity-60">{t('p.day')}</sub>
              </div>
              <p className="text-sm mt-5 leading-relaxed opacity-70">{t(card.note)}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl overflow-hidden border border-gray-200">
          <table className="sr-table w-full border-collapse text-base">
            <thead>
              <tr>
                <th className="text-left p-3">{t('sr.type')}</th>
                <th className="text-left p-3">{t('sr.period')}</th>
                <th className="text-left p-3">{t('sr.note')}</th>
              </tr>
            </thead>
            <tbody>
              {[['sr.r1','sr.r1p','sr.r1n'],['sr.r2','sr.r2p','sr.r2n'],['sr.r3','sr.r3p','sr.r3n'],['sr.r4','sr.r4p','sr.r4n']].map((row, i) => (
                <tr key={i}>
                  {row.map((k, j) => <td key={j} className="p-3 border-b border-gray-100">{t(k)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 6. 行事曆 ── */}
      <section id="calendar" className="py-24 px-[5%]" style={{ background: '#FFF8EE' }}>
        <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#0EA5E9' }}>Availability</p>
        <h2 className="font-black mb-3" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: '#1E3A5F' }}>{t('cal.title')}</h2>
        <p className="mb-8" style={{ color: '#4A7FA5' }}>{t('cal.desc')}</p>
        <div className="border-2 border-dashed border-blue-200 rounded-xl h-80 flex flex-col items-center justify-center gap-3" style={{ color: '#9CB3C9' }}>
          <span className="text-5xl">📅</span>
          <p className="text-sm">{t('cal.ph')}</p>
        </div>
        <div className="flex gap-6 mt-5 flex-wrap">
          {[['dot-green', '#4caf50', 'cal.a'],['dot-red', '#e53935', 'cal.f'],['dot-gray', '#9e9e9e', 'cal.p']].map(([, color, key]) => (
            <div key={key} className="flex items-center gap-2 text-sm" style={{ color: '#555' }}>
              <span className="w-3 h-3 rounded-full" style={{ background: color }} />
              {t(key)}
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. 預約表單 ── */}
      <section id="booking" className="py-24 px-[5%]" style={{ background: 'linear-gradient(160deg, #e0f7ff 0%, #bae6fd 50%, #e0f2fe 100%)' }}>
        <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#0EA5E9' }}>Reservation</p>
        <h2 className="font-black mb-3" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: '#1E3A5F' }}>{t('book.title')}</h2>
        <p className="mb-10" style={{ color: '#4A7FA5' }}>{t('book.desc')}</p>
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* 左欄：表單 */}
          <div className="bg-white rounded-2xl p-8 shadow-md">
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: '#333' }}>{t('f.name')} <span className="text-red-500">*</span></label>
                <input type="text" placeholder={t('f.name.ph')} className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: '#333' }}>{t('f.phone')} <span className="text-red-500">*</span></label>
                <input type="tel" placeholder="0912-345-678" className="form-input" />
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-bold mb-1.5" style={{ color: '#333' }}>{t('f.email')} <span className="text-red-500">*</span></label>
              <input type="email" placeholder="your@email.com" className="form-input" />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-bold mb-1.5" style={{ color: '#333' }}>{t('f.plan')}</label>
              <input type="text" value={t('f.plan.v')} readOnly className="form-input font-bold cursor-default" style={{ background: '#f0f7ff', color: '#0EA5E9' }} />
            </div>
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: '#333' }}>{t('f.in')} <span className="text-red-500">*</span></label>
                <input type="date" className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: '#333' }}>{t('f.out')} <span className="text-red-500">*</span></label>
                <input type="date" className="form-input" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: '#333' }}>{t('f.guests')} <span className="text-red-500">*</span></label>
                <input type="number" min="1" placeholder={t('f.guests.ph')} className="form-input" />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: '#333' }}>{t('f.source')}</label>
                <select className="form-input">
                  <option value="">{t('f.source.ph')}</option>
                  <option>Instagram</option>
                  <option>Facebook</option>
                  <option>{t('f.friend')}</option>
                  <option>Google</option>
                </select>
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold mb-1.5" style={{ color: '#333' }}>{t('f.notes')}</label>
              <textarea placeholder={t('f.notes.ph')} rows={3} className="form-input resize-y" />
            </div>
            <button className="w-full text-white font-bold py-4 rounded-lg text-base transition-opacity hover:opacity-90" style={{ background: '#0EA5E9' }}>
              {t('f.submit')}
            </button>
            <p className="text-center text-xs mt-4 leading-relaxed" style={{ color: '#888' }}>{t('f.note')}</p>
          </div>

          {/* 右欄：LINE 快速預約 + 注意事項 */}
          <div className="flex flex-col gap-5">
            {/* LINE 卡片 */}
            <div className="rounded-2xl p-6 text-white text-center shadow-md" style={{ background: 'linear-gradient(135deg, #06C755, #04a344)' }}>
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-black text-lg mb-2">{t('line.book.title')}</h3>
              <p className="text-base mb-4 opacity-90">{t('line.book.desc')}</p>
              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white font-black text-base py-3 rounded-lg no-underline hover:opacity-90 transition-opacity"
                style={{ color: '#06C755' }}
              >
                {t('line.book.btn')}
              </a>
              <p className="text-base mt-3 opacity-80">{t('line.book.id')}<strong>{LINE_ID}</strong></p>
            </div>

            {/* 預約說明 */}
            <div className="rounded-2xl p-6 bg-white shadow-md">
              <h4 className="font-bold text-sm mb-4" style={{ color: '#1E3A5F' }}>📋 預約注意事項</h4>
              {[
                { icon: '⏰', text: '送出表單後 24 小時內確認回覆' },
                { icon: '💳', text: '確認後將提供付款方式，完成訂金即完成預約' },
                { icon: '👥', text: '入場人數上限 10 人' },
                { icon: '🐾', text: '如有寵物或特殊需求，請於備註說明' },
                { icon: '📵', text: '若需即時回覆，建議直接加 LINE 詢問' },
              ].map((item, i) => (
                <div key={i} className="flex gap-2 items-start mb-3 last:mb-0">
                  <span className="flex-shrink-0">{item.icon}</span>
                  <p className="text-sm leading-relaxed" style={{ color: '#4A7FA5' }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. 附近景點 ── */}
      <section id="spots" className="py-24 px-[5%]">
        <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#0EA5E9' }}>Nearby</p>
        <h2 className="font-black mb-3" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: '#1E3A5F' }}>{t('spots.title')}</h2>
        <p className="mb-10" style={{ color: '#4A7FA5' }}>{t('spots.desc')}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { n: 's1.n', d: 's1.d', dist: 's1.dist', photo: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Su%27Ao%27s_Nanfangao_Port_from_above.jpg', credit: 'Bob Tan / Wikimedia Commons (CC BY 4.0)' },
            { n: 's2.n', d: 's2.d', dist: 's2.dist', photo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Taiwan_SuAo_Cold_Spring.JPG', credit: 'Vegafish / Wikimedia Commons (CC BY-SA 2.5)' },
            { n: 's3.n', d: 's3.d', dist: 's3.dist', photo: 'https://upload.wikimedia.org/wikipedia/commons/0/07/Su%27Ao%27s_Tofu_Cape_from_above.jpg', credit: 'Bob Tan / Wikimedia Commons (CC BY 4.0)' },
            { n: 's4.n', d: 's4.d', dist: 's4.dist', photo: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Waiao_Beach_%E5%A4%96%E6%BE%B3%E6%B5%B7%E7%81%98_-_panoramio.jpg', credit: 'lienyuan lee / Wikimedia Commons (CC BY 3.0)' },
            { n: 's5.n', d: 's5.d', dist: 's5.dist', photo: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Jiaosi_Hot_Spring_Hotels.jpg', credit: 'KasugaHuang / Wikimedia Commons (CC BY-SA 3.0)' },
            { n: 's6.n', d: 's6.d', dist: 's6.dist', photo: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/2014-01-29_Luodong_Night_Market_01.jpg', credit: 'tomscoffin / Wikimedia Commons (CC BY 2.0)' },
            { n: 's7.n', d: 's7.d', dist: 's7.dist', photo: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/%E5%8D%97%E6%96%B9%E6%BE%B3%E8%A7%80%E6%99%AF%E5%8F%B0.jpg', credit: '莊文生等／宜蘭縣政府文化局 (CC BY 3.0 TW)' },
            { n: 's8.n', d: 's8.d', dist: 's8.dist', photo: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/%E4%B8%83%E6%98%9F%E5%B6%BA%E6%AD%A5%E9%81%93.jpg', credit: '莊文生等／宜蘭縣政府文化局 (CC BY 3.0 TW)' },
          ].map((s, i) => (
            <div key={i} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-40 overflow-hidden">
                <img src={s.photo} alt={t(s.n)} className="w-full h-full object-cover" loading="lazy" />
                <span className="absolute bottom-1 right-1 text-white px-1.5 py-0.5 rounded" style={{ fontSize: '0.6rem', background: 'rgba(0,0,0,0.5)' }}>
                  © {s.credit}
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-base mb-1" style={{ color: '#1E3A5F' }}>{t(s.n)}</h4>
                <p className="text-sm leading-relaxed mb-2" style={{ color: '#666' }}>{t(s.d)}</p>
                <p className="text-sm font-bold" style={{ color: '#0EA5E9' }}>📍 {t(s.dist)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 9. 交通方式 ── */}
      <section id="transport" className="py-24 px-[5%]" style={{ background: '#FFF8EE' }}>
        <p className="text-xs font-bold tracking-[0.3em] uppercase mb-3" style={{ color: '#0EA5E9' }}>Getting Here</p>
        <h2 className="font-black mb-10" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)', color: '#1E3A5F' }}>{t('tr.title')}</h2>
        <div className="grid sm:grid-cols-2 gap-5 mb-8">
          {[
            { icon: '🚗', n: 't1.n', d: 't1.d' },
            { icon: '🚆', n: 't2.n', d: 't2.d' },
            { icon: '🚌', n: 't3.n', d: 't3.d' },
            { icon: '🚖', n: 't4.n', d: 't4.d' },
          ].map((tr, i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-6 bg-white shadow-sm">
              <div className="text-3xl mb-3">{tr.icon}</div>
              <h4 className="font-bold mb-2" style={{ color: '#1E3A5F' }}>{t(tr.n)}</h4>
              <p className="text-sm leading-relaxed" style={{ color: '#4A7FA5' }}>{t(tr.d)}</p>
            </div>
          ))}
        </div>
        {/* ── 附近公車資訊 ── */}
        <div className="mb-10">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2" style={{ color: '#1E3A5F' }}>
            🚌 {t('bus.title')}
          </h3>
          <div className="rounded-xl border border-blue-100 bg-white shadow-sm overflow-hidden">
            {/* 路線標題列 */}
            <div className="flex items-center gap-3 px-5 py-3" style={{ background: '#0EA5E9' }}>
              <span className="text-white font-black text-sm tracking-widest">綠 28</span>
              <span className="text-white text-sm font-semibold">蘇澳新站 ↔ 南方澳環線</span>
              <span className="ml-auto text-xs text-blue-100">Green Route 28</span>
            </div>
            {/* 資訊格 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-blue-50">
              <div className="px-4 py-3">
                <p className="text-xs font-bold mb-1" style={{ color: '#0EA5E9' }}>{t('bus.nearest')}</p>
                <p className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>南方澳大橋</p>
                <p className="text-xs mt-0.5" style={{ color: '#4A7FA5' }}>{t('bus.walk')}</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs font-bold mb-1" style={{ color: '#0EA5E9' }}>{t('bus.fare')}</p>
                <p className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>NT$ 20 現金</p>
                <p className="text-xs mt-0.5" style={{ color: '#4A7FA5' }}>NT$ 15 悠遊卡</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs font-bold mb-1" style={{ color: '#0EA5E9' }}>{t('bus.freq')}</p>
                <p className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>約 20–30 分鐘</p>
                <p className="text-xs mt-0.5" style={{ color: '#4A7FA5' }}>一班</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs font-bold mb-1" style={{ color: '#0EA5E9' }}>{t('bus.op')}</p>
                <p className="text-sm font-semibold" style={{ color: '#1E3A5F' }}>國光客運</p>
                <p className="text-xs mt-0.5" style={{ color: '#4A7FA5' }}>Kuokuang Bus</p>
              </div>
            </div>
            {/* 完整路線說明 */}
            <div className="px-5 py-3 text-xs border-t border-blue-50" style={{ color: '#4A7FA5', background: '#f0f9ff' }}>
              🗺 完整路線：蘇澳新站 → 蘇澳轉運站 → 蘇澳港 → <strong>豆腐岬</strong> → 內埤海邊 → 南寧市場 → 南方澳大橋 → 回蘇澳新站
            </div>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden shadow-md" style={{ height: '380px' }}>
          <iframe
            src="https://www.google.com/maps?q=情人灣停車場&output=embed&hl=zh-TW"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="mt-4 text-center">
          <a
            href="https://www.google.com/maps/search/?api=1&query=情人灣停車場"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-full no-underline hover:-translate-y-0.5 transition-transform text-sm"
            style={{ background: '#0EA5E9', color: '#fff' }}
          >
            📍 在 Google Maps 開啟導航
          </a>
        </div>
      </section>

      {/* ── 10. Footer ── */}
      <footer className="py-16 px-[5%]" style={{ background: '#1A4A6E', color: 'rgba(255,255,255,0.7)' }}>
        <div className="grid md:grid-cols-3 gap-12 pb-10 border-b border-white/10">
          <div>
            <h3 className="font-bold text-lg mb-2" style={{ color: '#7DD3FC' }}>灣灣拾光<br />Loverbay Moment Space</h3>
            <p className="text-sm leading-relaxed max-w-xs mb-4" style={{ color: 'rgba(255,255,255,.5)' }}>{t('ft.desc')}</p>
            <p className="text-sm leading-loose" style={{ color: 'rgba(255,255,255,.6)' }}>
              {t('ft.addr')}<br />
              📞 <a href={LINE_URL} target="_blank" rel="noopener noreferrer" className="no-underline" style={{ color: '#7DD3FC' }}>{t('ft.tel')} ({LINE_ID})</a><br />
              ✉️ contact@loverbay.com.tw
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-white">{t('ft.nav')}</h4>
            <ul className="list-none flex flex-col gap-2">
              {[
                ['#about', 'nav.about'], ['#spaces', 'nav.spaces'],
                ['#pricing', 'nav.pricing'], ['#calendar', 'cal.title'],
                ['#booking', 'hero.book'],
              ].map(([href, key]) => (
                <li key={key}><a href={href} className="text-sm no-underline transition-colors hover:text-[#7DD3FC]" style={{ color: 'rgba(255,255,255,.5)' }}>{t(key)}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4 text-white">{t('ft.contact')}</h4>
            <ul className="list-none flex flex-col gap-2">
              {[
                ['#', 'ft.line.acc'], ['#', 'Instagram'], ['#', 'Facebook'], ['#', 'ft.privacy']
              ].map(([href, key]) => (
                <li key={key}><a href={href} className="text-sm no-underline transition-colors hover:text-[#7DD3FC]" style={{ color: 'rgba(255,255,255,.5)' }}>{key === 'Instagram' || key === 'Facebook' ? key : t(key)}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="pt-6 flex flex-wrap justify-between items-center gap-3">
          <p className="text-xs" style={{ color: 'rgba(255,255,255,.35)' }}>{t('ft.copy')}</p>
          <div className="flex gap-4">
            {['Instagram', 'Facebook', 'LINE'].map(s => (
              <a key={s} href="#" className="text-sm no-underline transition-colors hover:text-[#7DD3FC]" style={{ color: 'rgba(255,255,255,.4)' }}>{s}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* ── 浮動 LINE 按鈕 ── */}
      <a
        href={LINE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="float-line fixed right-6 bottom-6 z-50 flex items-center justify-center w-14 h-14 rounded-full text-white text-2xl no-underline shadow-lg"
        style={{ background: '#06C755' }}
        title={t('float.label')}
      >
        💬
      </a>
    </>
  )
}
