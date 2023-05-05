<template>
  <div class="unfold-map" id="unfold-map" style="height: 100vh"></div>
</template>

<script>
import { getWorldMapData, getCountryPosition } from "/src/api/screen";
import staticData from "./data/data";
export default {
  name: "UnfoldMap",
  computed: {
    series() {
      let series = []; //攻击线路数据集
      let attackData = [];
      let machineAddress = this.machineAddress;
      let geoCoordMapAll = this.geoCoordMapAll;
      let worldCountryEN = this.worldCountryEN;
      let worldCountryZH = this.worldCountryZH;

      series.push(
        // 画出路径
        {
          //name: item[0] + ' Top10',
          type: "lines",
          zlevel: 1,
          // animation: true,
          effect: {
            show: true,
            // period: 2,
            trailLength: 0.7,
            // symbol: 'arrow',
            symbolSize: 5
            // loop: false
          },
          lineStyle: {
            normal: {
              width: 0
            }
          },
          // geoCoord: geoCoordMapAll,
          data: this.convertData(attackData)
        },

        // 画出闪光点
        {
          //		        name: item[0] + ' Top10',
          type: "effectScatter",
          coordinateSystem: "geo",
          zlevel: 2,
          animation: true,
          rippleEffect: {
            brushType: "stroke"
          },
          label: {
            normal: {
              show: true,
              position: "right",
              formatter: "{b}"
            }
          },
          symbol: "none",
          symbolSize: 15,
          //		        itemStyle: {
          //		            normal: {
          //		                color: color[0]
          //		            }
          //		        },
          data: attackData.map(dataItem => {
            let symbol =
              "/src/assets/images/page/point" + dataItem[1].eventType + ".png";
            return {
              symbol: symbol,

              name: dataItem[1].name,
              value: geoCoordMapAll[dataItem[1].name].concat([
                dataItem[1].value
              ]),
              itemStyle: {
                normal: {
                  color: this.color[dataItem[1].eventType - 1]
                }
              }
            };
          })
        }
      );
      //});
      //加入设备地址
      series.push({
        name: "",
        type: "scatter",
        coordinateSystem: "geo",
        data: this.convertMachine(machineAddress),
        symbol: "pin",
        symbolSize: 30,
        label: {
          normal: {
            formatter: () => {
              if (this.machineInChina) {
                return this.machineAddress[0].name;
              }
              if (navigator.language.indexOf("zh") > -1) {
                return worldCountryZH["00"];
              } else {
                return worldCountryEN["00"];
              }
            },
            position: "right",
            show: true
          }
        },
        itemStyle: {
          normal: {
            color: "rgba(255, 255, 255, 0.5)",
            shadowBlur: 10,
            shadowColor: "#333"
          }
        },
        zlevel: 1
      });
      return series;
    }
  },
  methods: {
    convertMachine(addressData) {
      var res = [];
      for (var i = 0; i < addressData.length; i++) {
        var geoCoord = this.geoCoordMapAll[addressData[i].name];
        var name = addressData[i].name;
        if (navigator.language.indexOf("zh") > -1) {
          name =
            this.worldCountryZH[name] == null
              ? name
              : this.worldCountryZH[name];
        } else {
          name =
            this.worldCountryEN[name] == null
              ? name
              : this.worldCountryEN[name];
        }
        if (geoCoord) {
          res.push({
            name: name,
            value: geoCoord
            //                value: geoCoord.concat(addressData[i].value)
          });
        }
      }
      return res;
    },
    setWorldMapData() {
      if (this.worldMapData.length == 0) return;
      var attackData1 = [];
      // 攻击国家，有可能不包含全部的被攻击国家
      // 用于记录所有的国家，去除攻击国家中相同数据之后，显示被攻击图标
      var countryMap = {};
      var attackCountryMap = {};

      // 获取设备部署地址
      let machineInChina = this.machineInChina;
      let machineAddress = this.machineAddress;
      this.worldMapData.forEach(function(d, i) {
        if (machineInChina && (d.ascountry == "cn" || d.ascountry == "00")) {
          attackCountryMap[d.asregdetail] = 1;
          var dname =
            d.adcountry == "cn" || d.adcountry == "00"
              ? d.adregdetail
              : d.adcountry;
          countryMap[d.asregdetail] = 1;
          countryMap[dname] = 1;
          attackData1.push([
            { name: machineAddress[0].name },
            {
              name: d.asregdetail,
              eventType: d.eventType,
              isCN: true
            },
            { name: dname }
          ]);
        } else {
          var dname = d.adcountry;
          if (machineInChina) {
            dname =
              d.adcountry == "cn" || d.adcountry == "00"
                ? d.adregdetail
                : d.adcountry;
          }
          attackCountryMap[d.ascountry] = 1;
          countryMap[d.ascountry] = 1;
          countryMap[dname] = 1;
          attackData1.push([
            { name: machineAddress[0].name },
            { name: d.ascountry, eventType: d.eventType, isCN: false },
            { name: d.adcountry }
          ]);
        }
      });
      //将已存在于攻击国家中的值去除
      Object.entries(attackCountryMap).forEach((key, value) => {
        if (countryMap[key] && countryMap[key] == 1) countryMap[key] = 0;
      });
      // 防止中国和cn显示重复
      if (attackCountryMap["cn"] || attackCountryMap["中国"]) {
        countryMap["cn"] = 0;
        countryMap["中国"] = 0;
      } else if (countryMap["cn"]) {
        countryMap["中国"] = 0;
      }

      let option = {};
      option.series = this.myChart.getOption().series;
      option.series[0].data = this.convertData(attackData1);
      //修改数组中的值
      var series1Data = attackData1.map(function(dataItem) {
        var name =
          dataItem[1].name == "Local" ? dataItem[0].name : dataItem[1].name;
        var value;
        if (this.worldConfig != "world" && this.worldConfig != "china") {
          value = this.provincesGeoData[dataItem[1].name];
        } else {
          value = this.geoCoordMapAll[
            dataItem[1].name == "Local" ? dataItem[0].name : dataItem[1].name
          ];
        }
        if (!dataItem[1].isCN) {
          if (navigator.language.indexOf("zh") > -1) {
            name = this.worldCountryZH[name];
          } else {
            name = this.worldCountryEN[name];
          }
        }

        var pointValue = 8;
        if (dataItem[1].eventType > 7) {
          pointValue = 10;
        } else if (dataItem[1].eventType > 5) {
          pointValue = 9;
        }
        return {
          // symbol: 'image:///src/assets/images/page/point' + pointValue + '.png',
          symbol:
            "image://" +
            require("/src/assets/images/page/point" + pointValue + ".png"),
          name: name,
          value: value,
          eventType: dataItem[1].eventType,
          itemStyle: {
            normal: {
              color: this.color[pointValue - 8]
            }
          }
        };
      }, this);

      Object.entries(countryMap).forEach((key, value) => {
        if (value == 1) {
          var name = key;
          if (navigator.language.indexOf("zh") > -1) {
            name =
              this.worldCountryZH[key] == null ? key : this.worldCountryZH[key];
          } else {
            name =
              this.worldCountryEN[key] == null ? key : this.worldCountryEN[key];
          }

          series1Data.push({
            symbol: "pin",
            name: name,
            value: this.geoCoordMapAll[key],
            itemStyle: {
              normal: {
                color: "#fff"
              }
            }
          });
        }
      });

      option.series[1].data = series1Data;
      this.myChart.setOption(option);
    },
    convertData(data) {
      var res = [];
      for (var i = 0; i < data.length; i++) {
        var dataItem = data[i];
        var fromCoord;
        if (dataItem[2].name == "Local") {
          fromCoord = this.geoCoordMapAll[dataItem[0].name];
        } else {
          fromCoord = this.geoCoordMapAll[dataItem[2].name];
        }
        var toCoord;
        if (dataItem[1].name == "Local") {
          toCoord = this.geoCoordMapAll[dataItem[0].name];
        } else {
          toCoord = this.geoCoordMapAll[dataItem[1].name];
        }
        var pointValue = 8;
        if (dataItem[1].eventType > 7) {
          pointValue = 10;
        } else if (dataItem[1].eventType > 5) {
          pointValue = 9;
        }
        if (fromCoord && toCoord) {
          res.push({
            //fromName: dataItem[0].name,
            //toName: dataItem[1].name,
            coords: [toCoord, fromCoord],
            lineStyle: {
              normal: {
                color: this.color[pointValue - 8] // 线颜色
              }
            }
          });
        }
      }
      return res;
    },

    getWorldConfig(worldMap) {
      if (worldMap == this.worldConfig) {
        return;
      }

      // $('#unfold-map').html('')  // 不删会无法切换
      this.worldConfig = worldMap;
      //获取设备部署地址
      getCountryPosition().then(data => {
        if (data != null && data.length > 0) {
          this.machineAddress[0].name = data.split("-")[1];
          if (data.split("-")[0] == "cn") {
            this.machineInChina = true;
          } else {
            this.machineInChina = false;
          }
          var geoCoord = this.geoCoordMapAll[this.machineAddress[0].name];
          this.machineAddress[0].value = geoCoord;
          this.geoCoordMapAll["00"] = geoCoord;
          this.worldCountryZH["00"] = this.worldCountryZH[
            this.machineAddress[0].name
          ];
          this.worldCountryEN["00"] = this.worldCountryEN[
            this.machineAddress[0].name
          ];
        }

        var mZoom = 1;
        var mCenter = "";
        var showCountryName = true;
        if (worldMap == "world") {
          // 	mZoom = 2.5;
          // 	mCenter = machineAddress[0].value;
          showCountryName = false;
        }
        var dom = document.getElementById("unfold-map");
        this.myChart = this.$echarts.init(dom);
        window.onresize = () => this.myChart.resize();

        // var attackData = []
        // var series = [] //攻击线路数据集
        // //[[machineAddress[0].name, attackData]].forEach(function (item, i) {
        // series.push(
        //   // 画出路径
        //   {
        //     //name: item[0] + ' Top10',
        //     type: 'lines',
        //     zlevel: 1,
        //     // animation: true,
        //     effect: {
        //       show: true,
        //       // period: 2,
        //       trailLength: 0.7,
        //       // symbol: 'arrow',
        //       symbolSize: 5,
        //       // loop: false
        //     },
        //     lineStyle: {
        //       normal: {
        //         width: 0,
        //       },
        //     },
        //     // geoCoord: geoCoordMapAll,
        //     data: convertData(attackData),
        //   },

        //   // 画出闪光点
        //   {
        //     //		        name: item[0] + ' Top10',
        //     type: 'effectScatter',
        //     coordinateSystem: 'geo',
        //     zlevel: 2,
        //     animation: true,
        //     rippleEffect: {
        //       brushType: 'stroke',
        //     },
        //     label: {
        //       normal: {
        //         show: true,
        //         position: 'right',
        //         formatter: '{b}',
        //       },
        //     },
        //     symbol: 'none',
        //     symbolSize: 15,
        //     //		        itemStyle: {
        //     //		            normal: {
        //     //		                color: color[0]
        //     //		            }
        //     //		        },
        //     data: attackData.map(function (dataItem) {
        //       return {
        //         symbol:
        //           'image://../../images/page/point' +
        //           dataItem[1].eventType +
        //           '.png',
        //         name: dataItem[1].name,
        //         value: geoCoordMapAll[dataItem[1].name].concat([
        //           dataItem[1].value,
        //         ]),
        //         itemStyle: {
        //           normal: {
        //             color: color[dataItem[1].eventType - 1],
        //           },
        //         },
        //       }
        //     }),
        //   }
        // )
        // //});
        // //加入设备地址
        // series.push({
        //   name: '',
        //   type: 'scatter',
        //   coordinateSystem: 'geo',
        //   data: convertMachine(machineAddress),
        //   symbol: 'pin',
        //   symbolSize: 30,
        //   label: {
        //     normal: {
        //       formatter: function () {
        //         if (machineInChina) {
        //           return machineAddress[0].name
        //         }
        //         if ($.i18n.browserLang().indexOf('zh') > -1) {
        //           return worldCountryZH['00']
        //         } else {
        //           return worldCountryEN['00']
        //         }
        //       },
        //       position: 'right',
        //       show: true,
        //     },
        //   },
        //   itemStyle: {
        //     normal: {
        //       color: 'rgba(255, 255, 255, 0.5)',
        //       shadowBlur: 10,
        //       shadowColor: '#333',
        //     },
        //   },
        //   zlevel: 1,
        // })

        //攻击项
        let option = {
          backgroundColor: "#181f32",
          tooltip: {
            trigger: "item",
            show: false,
            formatter: function(params) {
              var str = params.data.name;
              if (params.data.total) {
                str +=
                  "<br/>" +
                  eventTypeMap[params.data.eventType] +
                  "<br/>攻击次数：" +
                  params.data.total;
              }
              return str;
            }
          },
          geo: {
            map: worldMap,
            label: {
              normal: {
                show: showCountryName,
                areaColor: "#CECECE",
                borderColor: "#FCFCFC",
                // borderWidth: '1',
                textStyle: {
                  color: "rgba(255, 255, 255, 0.5)"
                }
              },
              emphasis: {
                show: true,
                textStyle: {
                  color: "rgba(255, 255, 255, 0.5)"
                }
              }
            },
            roam: true /*是否开启鼠标缩放和平移漫游 true 为都开启*/,
            center: mCenter /*当前视角的中心点，用经纬度表示*/,
            zoom: mZoom /*当前视角的缩放比例*/,
            scaleLimit: {
              max: 10,
              min: mZoom
            },
            itemStyle: {
              normal: {
                areaColor: "rgba(10, 93, 173, 0.3)",
                borderColor: "rgba(76, 88, 121, 0.7)"
              },
              emphasis: {
                areaColor: "rgba(111, 169, 217, 0.5)"
              }
            }
          },
          series: this.series,
          nameMap: {
            Andorra: "安道尔",
            "United Arab Emirates": "阿拉伯联合酋长国",
            Afghanistan: "阿富汗",
            "Antigua and Barbuda": "安提瓜和巴布达",
            Anguilla: "安圭拉",
            Albania: "阿尔巴尼亚",
            Armenia: "亚美尼亚",
            Angola: "安哥拉",
            Antarctica: "南极洲",
            Argentina: "阿根廷",
            "American Samoa": "美属萨摩亚",
            Austria: "奥地利",
            Australia: "澳大利亚",
            Aruba: "阿鲁巴",
            Åland: "奥兰群岛",
            Azerbaijan: "阿塞拜疆",
            "Bosnia and Herzegovina": "波黑",
            Barbados: "巴巴多斯",
            Bangladesh: "孟加拉",
            Belgium: "比利时",
            "Burkina Faso": "布基纳法索",
            Bulgaria: "保加利亚",
            Bahrain: "巴林",
            Burundi: "布隆迪",
            Benin: "贝宁",
            Saint: "圣巴泰勒米",
            Bermuda: "百慕大",
            Brunei: "文莱",
            Bolivia: "玻利维亚",
            Bonaire: "博奈尔岛、圣尤斯达蒂斯和萨巴",
            Brazil: "巴西",
            Bahamas: "巴哈马",
            Bhutan: "不丹",
            Botswana: "博茨瓦纳",
            Belarus: "白俄罗斯",
            Belize: "伯利兹",
            Canada: "加拿大",
            Congo: "扎伊尔",
            "Central African Republic": "中非共和国",
            "Republic of the Congo": "刚果",
            Switzerland: "瑞士",
            "Ivory Coast": "象牙海岸",
            "Cook Islands": "库克群岛",
            Chile: "智利",
            Cameroon: "喀麦隆",
            China: "中国",
            Colombia: "哥伦比亚",
            "Costa Rica": "哥斯达黎加",
            Cuba: "古巴",
            "Cape Verde": "佛得角",
            Curaçao: "库拉索",
            Cyprus: "塞浦路斯",
            "Czech Republic": "捷克共和国",
            Germany: "德国",
            Djibouti: "吉布提",
            Denmark: "丹麦",
            Dominica: "多米尼克",
            "Dominican Republic": "多米尼加共和国",
            Algeria: "阿尔及利亚",
            Ecuador: "厄瓜多尔",
            Estonia: "爱沙尼亚",
            Egypt: "埃及",
            Eritrea: "厄立特里亚",
            Spain: "西班牙",
            Ethiopia: "埃塞俄比亚",
            Finland: "芬兰",
            Fiji: "斐济",
            "Falkland Islands": "福克兰群岛",
            "Federated States of Micronesia": "密克罗尼西亚",
            "Faroe Islands": "法罗群岛",
            France: "法国",
            Gabon: "加蓬",
            "United Kingdom": "英国",
            Grenada: "格林纳达",
            Georgia: "格鲁吉亚",
            "French Guiana": "法属圭亚那",
            Guernsey: "格恩西岛",
            Ghana: "加纳",
            Gibraltar: "直布罗陀",
            Greenland: "格陵兰",
            Gambia: "冈比亚",
            Guinea: "几内亚",
            Guadeloupe: "瓜德罗普岛",
            "Equatorial Guinea": "赤道几内亚",
            Greece: "希腊",
            Guatemala: "危地马拉",
            Guam: "关岛",
            "Guinea Bissau": "几内亚比绍",
            Guyana: "圭亚那",
            Honduras: "洪都拉斯",
            Croatia: "克罗地亚",
            Haiti: "海地",
            Hungary: "匈牙利",
            Indonesia: "印度尼西亚",
            Ireland: "爱尔兰",
            Israel: "以色列",
            "Isle of Man": "曼岛",
            India: "印度",
            "British Indian Ocean Territory": "英属印度洋领地",
            Iraq: "伊拉克",
            Iran: "伊朗伊斯兰共和国",
            Iceland: "冰岛",
            Italy: "意大利",
            Jersey: "泽西岛",
            Jamaica: "牙买加",
            "Hashemite Kingdom of Jordan": "约旦",
            Japan: "日本",
            Kenya: "肯尼亚",
            Kyrgyzstan: "吉尔吉克斯坦",
            Cambodia: "柬埔寨",
            Kiribati: "基里巴斯",
            Comoros: "科摩罗",
            "Saint Kitts and Nevis": "圣基茨和尼维斯",
            "North Korea": "朝鲜民主共和国",
            "Republic of Korea": "韩国",
            Kuwait: "科威特",
            "Cayman Islands": "开曼群岛",
            Kazakhstan: "哈萨克斯坦",
            Laos: "老挝人民民主共和国",
            Lebanon: "黎巴嫩",
            "Saint Lucia": "圣卢西亚",
            Liechtenstein: "列支敦士登",
            "Sri Lanka": "斯里兰卡",
            Liberia: "利比里亚",
            Lesotho: "莱索托",
            "Republic of Lithuania": "立陶宛",
            Luxembourg: "卢森堡",
            Latvia: "拉脱维亚",
            Libya: "阿拉伯利比亚民众国",
            Morocco: "摩洛哥",
            Monaco: "摩纳哥",
            "Republic of Moldova": "摩尔多瓦共和国",
            Montenegro: "黑山共和国",
            "Saint Martin": "圣马丁",
            Madagascar: "马达加斯加",
            "Marshall Islands": "马绍尔群岛",
            Macedonia: "马其顿",
            Mali: "马里",
            "Myanmar (Burma)": "缅甸",
            Mongolia: "蒙古",
            "Northern Mariana Islands": "北马里亚纳群岛",
            Martinique: "马提尼克群岛",
            Mauritania: "毛里塔尼亚",
            Montserrat: "蒙塞拉特群岛",
            Malta: "马耳他",
            Mauritius: "毛里求斯",
            Maldives: "马尔代夫",
            Malawi: "马拉维",
            Mexico: "墨西哥",
            Malaysia: "马来西亚",
            Mozambique: "莫桑比克",
            Namibia: "纳米比亚",
            "New Caledonia": "新喀里多尼亚",
            Niger: "尼日尔",
            "Norfolk Island": "诺福克岛",
            Nigeria: "尼日利亚",
            Nicaragua: "尼加拉瓜",
            Netherlands: "荷兰",
            Norway: "挪威",
            Nepal: "尼泊尔",
            Nauru: "瑙鲁",
            Niue: "纽埃",
            "New Zealand": "新西兰",
            Oman: "阿曼",
            Panama: "巴拿马",
            Peru: "秘鲁",
            "French Polynesia": "法属波利尼西亚",
            "Papua New Guinea": "巴布亚新几内亚",
            Philippines: "菲律宾",
            Pakistan: "巴基斯坦",
            Poland: "波兰",
            "Saint Pierre and Miquelon": "圣皮埃尔和密克隆",
            "Puerto Rico": "波多黎各",
            Palestine: "巴勒斯坦领土",
            Portugal: "葡萄牙",
            Palau: "帕劳",
            Paraguay: "巴拉圭",
            Qatar: "卡塔尔",
            Réunion: "留尼汪",
            Romania: "罗马尼亚",
            Serbia: "塞尔维亚",
            Russia: "俄罗斯",
            Rwanda: "卢旺达",
            "Saudi Arabia": "沙特阿拉伯",
            "Solomon Islands": "所罗门群岛",
            Seychelles: "塞舌尔群岛",
            Sudan: "苏丹",
            Sweden: "瑞典",
            Singapore: "新加坡",
            Slovenia: "斯洛文尼亚",
            "Svalbard and Jan Mayen": "斯瓦尔巴特和扬马延",
            "Slovak Republic": "斯洛伐克共和国",
            "Sierra Leone": "塞拉利昂",
            "San Marino": "圣马力诺",
            Senegal: "塞内加尔",
            Somalia: "索马里",
            Suriname: "苏里南",
            "South Sudan": "南苏丹",
            "São Tomé and Príncipe": "圣多美和普林西比",
            "El Salvador": "萨尔瓦多",
            "Sint Maarten": "圣马丁岛",
            Syria: "叙利亚",
            Swaziland: "斯威士兰",
            "Turks and Caicos Islands": "特克斯和凯科斯群岛",
            Chad: "乍得",
            Togo: "多哥",
            Thailand: "泰国",
            Tajikistan: "塔吉克斯坦",
            Tokelau: "托克劳",
            "East Timor": "东帝汶",
            Turkmenistan: "土库曼斯坦",
            Tunisia: "突尼斯",
            Tonga: "汤加",
            Turkey: "土耳其",
            "Trinidad and Tobago": "特立尼达和多巴哥",
            Tuvalu: "图瓦卢",
            Tanzania: "坦桑尼亚",
            Ukraine: "乌克兰",
            Uganda: "乌干达",
            "U.S. Minor Outlying Islands": "美国边远小岛",
            "United States": "美国",
            Uruguay: "乌拉圭",
            Uzbekistan: "乌兹别克斯坦",
            "Vatican City": "圣座（梵蒂冈）",
            "Saint Vincent and the Grenadines": "圣文森特和格林纳丁斯",
            Venezuela: "委内瑞拉",
            "British Virgin Islands": "英属维京群岛",
            "U.S. Virgin Islands": "美属维京群岛",
            Vietnam: "越南",
            Vanuatu: "瓦努阿图",
            "Wallis and Futuna": "瓦利斯和富图纳",
            Samoa: "萨摩亚",
            Kosovo: "科索沃",
            Yemen: "也门",
            Mayotte: "马约特",
            "South Africa": "南非",
            Zambia: "赞比亚",
            Zimbabwe: "津巴布韦",
            Vatican: "梵蒂冈",
            Kerguelen: "法国属地-凯尔盖朗群岛（克尔格伦群岛）",
            "New Caledonia": "法国属地-新喀里多尼亚",
            "Northern Cyprus": "北塞浦路斯",
            "Tristan da Cunha": "英国-特里斯坦-达库尼亚群岛",
            Kashmir: "克什米尔",
            "Puerto Rico": "美国-波多黎各",
            "Western Sahara": "西撒哈拉",
            Somaliland: "索马里兰"
          }
        };
        if (option && typeof option == "object") {
          this.myChart.setOption(option, true);
        }
        this.initWorldMap();
      });
    },
    initWorldMap() {
      getWorldMapData()
        .then(data => {
          this.worldMapData = data;
          if (!this.timer) {
            this.timer = setInterval(this.setWorldMapData, 4600);
            console.log('debug | set timer: ', this.timer)
            this.$once('hook:beforeDestroy', () => {
            console.log('debug | clear timer: ', this.timer)
            clearInterval(this.timer)
          })
          }

        })
        .catch(() => this.initWorldMap());
    }
  },
  created() {
    this.myChart = {};
    this.attackData = {};
    this.worldMapData = [];
    this.machineInChina = true;
    this.worldConfig = "";
    this.provincesGeoData = {};
    this.color = ["#03a2dc", "#ae5d8d", "#b75d3b"];
    this.geoCoordMapAll = staticData.geoCoordMapAll;
    this.machineAddress = staticData.machineAddress;
    this.worldCountryZH = staticData.worldCountryZH;
    this.worldCountryEN = staticData.worldCountryEN;
    this.timer = null
  },
  mounted() {
    this.getWorldConfig("world");
  }
};
</script>

<style>
  .unfold-map{
    overflow: hidden;
    position: relative;
    z-index: 0;
    background: #2a4264 none repeat scroll 0% 0%;
    color: #000;
    text-align: left;
    height:100vh;
    width:100%;
  }
</style>
