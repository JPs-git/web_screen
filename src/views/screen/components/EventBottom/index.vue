<template>
  <div
    class="event-bottom"
    id="event-bottom"
    style="width: 1216px"
    :class="`${showEventBottom ? '' : 'hidden-bottom'}`"
  >
    <div class="event-bottom-bg" id="event-bottom-bg"></div>
    <div class="event-bottom-former" id="event-bottom-former">
      <h5>
        实时告警
        <span
          id="event-list04"
          class="fr"
          :class="showEventBottom ? 'icon-list-down' : 'icon-list-up '"
          @click="() => (showEventBottom = !showEventBottom)"
        ></span>
      </h5>
      <div class="risk">
        <h3></h3>
        <ul id="alarmUl">
          <li v-for="(item, index) in eventList" :key="index">
            <h6>{{ attackDate(item.lastTime).slice(11) }}</h6>
            <span :class="'risk0' + item.level"
              ><div class="asset-wrap3">
                <div class="asset-des3">
                  <h3>
                    {{
                      attackDate(item.lastTime).slice(0, 10) +
                      ' ' +
                      attackDate(item.lastTime).slice(11)
                    }}
                  </h3>
                  <p>
                    检测到&nbsp;<span :class="`level${item.level}`">{{
                      riskLevel(item.level)
                    }}</span
                    >攻击
                  </p>
                  <ol>
                    <li>该IP攻击：【{{ item.total }}】次</li>
                    <li>攻击者IP为：【{{ item.asip }}】</li>
                    <li>
                      来源于 :<span class="flag"
                        ><span :class="`flag_${item.ascountry}`"></span
                        >{{ item.asregdetail }}</span
                      >
                    </li>
                  </ol>
                </div>
              </div>
              <img
                :src="require(`/src/assets/images/risk0${item.level - 2}.png`)"
            /></span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getRealtimeAlert } from '/src/api/screen'
import { formatDate } from '/src/utils/common'
export default {
  data() {
    return {
      showEventBottom: true,
      // 实时告警信息列表，每一项都是一条告警信息
      eventList: [],
    }
  },
  computed: {
    attackDate() {
      return formatDate
    },
    riskLevel() {
      return function (level) {
        if (level === 4) {
          return '高危'
        }
        if (level === 3) {
          return '中危'
        }
        if (level === 2) {
          return '低危'
        }
      }
    },
  },
  methods: {
    wait(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // console.log("Done waiting");
          resolve(ms)
        }, ms)
      })
    },
    async insertData(dataList) {
      const MAX_LIST_LENGTH = 19
      for (let item of dataList) {
        await this.wait(500)
        if (this.eventList.length >= MAX_LIST_LENGTH) {
          this.eventList.shift()
        }
        this.eventList.push(item)
      }
    },
  },
  mounted() {
    getRealtimeAlert().then((data) => {
      console.log('debug | realtime_alert', data)
      // data.data.forEach(this.insertData);
      this.insertData(data.data)
    })
  },
}
</script>

<style>
.event-bottom {
  position: absolute;
  z-index: 9999;
  bottom: 0px;
  left: 0px;
  width: 100%;
  height: 160px;
  color: #fafbff;
  padding-right: 320px;
}
.event-bottom-bg {
  position: absolute;
  z-index: 10001;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 160px;
  background: #131928;
  filter: alpha(opacity=60); /*IE滤镜，透明度50%*/
  -moz-opacity: 0.6; /*Firefox私有，透明度50%*/
  opacity: 0.6; /*其他，透明度50%*/
}
.event-bottom-former {
  position: absolute;
  z-index: 10005;
  margin: 0px;
  padding: 0px;
  width: 100%;
  height: 160px;
}
.event-bottom h5 {
  height: 40px;
  line-height: 40px;
  color: #399bfe;
  margin: 0px;
  padding: 0px 15px;
}
.asset-wrap3 {
  position: absolute;
  bottom: 40px;
  left: -60px;
  z-index: 10008;
  display: none;
}
.risk04:hover .asset-wrap3,
.risk03:hover .asset-wrap3,
.risk02:hover .asset-wrap3 {
  display: block;
}
.asset-des3 {
  width: 240px;
  padding: 10px;
  background-color: #181f32;
  position: relative;
  border: 1px solid #2d6fb6;
  text-align: left;
}
.asset-des3 h3 {
  font-size: 13px;
  color: #ff7200;
  margin: 0px 0px 10px 0px;
  padding: 0px;
}
.asset-des3 p {
  font-size: 13px;
  color: #8bd9ff;
  margin: 0px 0px 10px 0px;
  padding: 0px;
  font-weight: bold;
}
.asset-des3 ol {
  margin: 0px;
  padding: 0px;
  list-style: none;
}
.asset-des3 ol li {
  color: #399bfe;
  margin: 0px;
  padding: 0px;
  word-wrap: break-word;
  word-break: break-all;
}
.event-bottom .risk {
  position: relative;
}
.event-bottom .risk > h3 {
  position: absolute;
  top: 10px;
  left: 15px;
  background: url(~/src/assets/images/risk-tit.png) no-repeat scroll 50% 50%;
  display: inline-block;
  height: 60px;
  width: 24px;
}
.event-bottom .risk > ul {
  display: inline-block;
  margin: 0px;
  padding: 0px;
  width: 100%;
  background: url(~/src/assets/images/risk-line.png) repeat scroll 50% 50%;
  height: 105px;
  padding-left: 50px;
}
.event-bottom .risk > ul > li {
  list-style-type: none;
  width: 60px;
  height: 100px;
  text-align: center;
  float: left;
  position: relative;
}
.event-bottom .risk > ul > li > .risk04,
.event-bottom .risk > ul > li > .risk03,
.event-bottom .risk > ul > li > .risk02 {
  position: absolute;
  top: 25px;
  left: 50%;
  margin-left: -16px;
}
.event-bottom .risk > ul > li > .risk03 {
  top: 50px;
}
.event-bottom .risk > ul > li > .risk02 {
  top: 75px;
}
.event-bottom .risk > ul > li h6 {
  margin: 0px;
  line-height: 30px;
  height: 30px;
  margin-bottom: -5px;
}
.icon-list-down {
  background: url(~/src/assets/images/page/icon-list-down.png) no-repeat scroll
    50% 50%;
  width: 17px;
  height: 10px;
  margin: 12px 0px;
  cursor: pointer;
  display: inline-block;
}
.fr {
  float: right;
}
.level4 {
  padding: 2px 8px;
  background: #e1556f;
  border-radius: 2px;
  color: #fff;
  font-size: 12px;
}
.level3 {
  padding: 2px 8px;
  background: #ffa352;
  border-radius: 2px;
  color: #fff;
  font-size: 12px;
}
.level2 {
  padding: 2px 8px;
  background: #47b99e;
  border-radius: 2px;
  color: #fff;
  font-size: 12px;
}
.hidden-bottom {
  height: 45px;
  overflow: hidden;
}
</style>
