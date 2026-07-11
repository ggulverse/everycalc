/* ==================================================
   EveryCalc - currencies.js
   Currency Data
================================================== */

const currencyGroups = [

    /* ==========================================
       주요 통화
    ========================================== */

    {

        group: "⭐ 주요 통화",

        currencies: [

            {

                code: "USD",
                name: "미국 달러",
                flag: "🇺🇸"

            },

            {

                code: "KRW",
                name: "대한민국 원",
                flag: "🇰🇷"

            },
           
            {

                code: "EUR",
                name: "유로",
                flag: "🇪🇺"

            },

            {

                code: "JPY",
                name: "일본 엔",
                flag: "🇯🇵"

            },

            {

                code: "CNY",
                name: "중국 위안",
                flag: "🇨🇳"

            },

            {

                code: "GBP",
                name: "영국 파운드",
                flag: "🇬🇧"

            }

        ]

    },



    /* ==========================================
       아시아 · 태평양
    ========================================== */

    {

        group: "🌏 아시아 · 태평양",

        currencies: [

            {

                code: "HKD",
                name: "홍콩 달러",
                flag: "🇭🇰"

            },

            {

                code: "SGD",
                name: "싱가포르 달러",
                flag: "🇸🇬"

            },

            {

                code: "TWD",
                name: "대만 달러",
                flag: "🇹🇼"

            },

            {

                code: "THB",
                name: "태국 바트",
                flag: "🇹🇭"

            },

            {

                code: "MYR",
                name: "말레이시아 링깃",
                flag: "🇲🇾"

            },

            {

                code: "IDR",
                name: "인도네시아 루피아",
                flag: "🇮🇩"

            },

            {

                code: "PHP",
                name: "필리핀 페소",
                flag: "🇵🇭"

            },

            {

                code: "VND",
                name: "베트남 동",
                flag: "🇻🇳"

            },

            {

                code: "INR",
                name: "인도 루피",
                flag: "🇮🇳"

            },

            {

                code: "AUD",
                name: "호주 달러",
                flag: "🇦🇺"

            },

            {

                code: "NZD",
                name: "뉴질랜드 달러",
                flag: "🇳🇿"

            }

        ]

    },
   /* ==========================================
       유럽
    ========================================== */

    {

        group: "🇪🇺 유럽",

        currencies: [

            {

                code: "CHF",
                name: "스위스 프랑",
                flag: "🇨🇭"

            },

            {

                code: "NOK",
                name: "노르웨이 크로네",
                flag: "🇳🇴"

            },

            {

                code: "SEK",
                name: "스웨덴 크로나",
                flag: "🇸🇪"

            },

            {

                code: "DKK",
                name: "덴마크 크로네",
                flag: "🇩🇰"

            },

            {

                code: "PLN",
                name: "폴란드 즈워티",
                flag: "🇵🇱"

            },

            {

                code: "CZK",
                name: "체코 코루나",
                flag: "🇨🇿"

            },

            {

                code: "HUF",
                name: "헝가리 포린트",
                flag: "🇭🇺"

            },

            {

                code: "RON",
                name: "루마니아 레우",
                flag: "🇷🇴"

            },

            {

                code: "RUB",
                name: "러시아 루블",
                flag: "🇷🇺"

            }

        ]

    },



    /* ==========================================
       미주
    ========================================== */

    {

        group: "🌎 미주",

        currencies: [

            {

                code: "CAD",
                name: "캐나다 달러",
                flag: "🇨🇦"

            },

            {

                code: "MXN",
                name: "멕시코 페소",
                flag: "🇲🇽"

            },

            {

                code: "BRL",
                name: "브라질 헤알",
                flag: "🇧🇷"

            },

            {

                code: "ARS",
                name: "아르헨티나 페소",
                flag: "🇦🇷"

            },

            {

                code: "CLP",
                name: "칠레 페소",
                flag: "🇨🇱"

            }

        ]

    },
    /* ==========================================
       중동 · 아프리카
    ========================================== */

    {

        group: "🌍 중동 · 아프리카",

        currencies: [

            {

                code: "AED",
                name: "UAE 디르함",
                flag: "🇦🇪"

            },

            {

                code: "SAR",
                name: "사우디 리얄",
                flag: "🇸🇦"

            },

            {

                code: "QAR",
                name: "카타르 리얄",
                flag: "🇶🇦"

            },

            {

                code: "KWD",
                name: "쿠웨이트 디나르",
                flag: "🇰🇼"

            },

            {

                code: "TRY",
                name: "튀르키예 리라",
                flag: "🇹🇷"

            },

            {

                code: "ZAR",
                name: "남아공 랜드",
                flag: "🇿🇦"

            },

            {

                code: "EGP",
                name: "이집트 파운드",
                flag: "🇪🇬"

            }

        ]

    }


];



/* ==================================================
   전체 통화 배열 변환
   exchange.js 사용용
================================================== */


const currencies = [];


currencyGroups.forEach(group => {


    group.currencies.forEach(currency => {


        currencies.push({

            ...currency,

            group: group.group

        });


    });


});
