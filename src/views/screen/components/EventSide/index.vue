<template>
  <div class="event-side" style="cursor: ew-resize" id="box">
    <div
      class="event-side-con"
      id="event-side-con"
      style="height: auto; background: none; cursor: default"
    >
      <div class="row">
        <ul class="nav nav-tabs" id="nav-tabs-prime">
          <li
            :class="activeTable === 'tenSource' ? 'active' : ''"
            @click="() => (activeTable = 'tenSource')"
          >
            <a href="javascript: void(0);">十大攻击源</a>
          </li>
          <li
            :class="activeTable === 'tenType' ? 'active' : ''"
            @click="() => (activeTable = 'tenType')"
          >
            <a href="javascript: void(0);">十大攻击类型</a>
          </li>
          <li
            :class="activeTable === 'todayAccess' ? 'active' : ''"
            @click="() => (activeTable = 'todayAccess')"
          >
            <a href="javascript: void(0);">今日访问</a>
          </li>
        </ul>
      </div>
      <div class="tab-content">
        <span class="rowd rowd1"></span>
        <span class="rowd rowd2"></span>
        <span class="col col2"></span>
        <span class="col col1"></span>
        <!-- 十大攻击源 -->
        <div
          class="tab-pane tabHih"
          :class="activeTable === 'tenSource' ? 'active' : ''"
          id="topNTabPane1"
        >
          <div class="tab-table">
            <h3><span></span>攻击源</h3>
            <table id="topNAsip">
              <thead>
                <tr>
                  <th>地址/类型</th>
                  <th>攻击次数</th>
                  <th>国家</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in tenSourceData" :key="index">
                  <td>{{ item.ip }}</td>
                  <td>{{ item.attackTimes }}</td>
                  <td>
                    <span class="flag" :title="item.asregdetail">
                      <span :class="`flag_${item.ascountry}`"></span
                      >{{ item.asregdetail }}</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!--<div class="tab-table">
							<h3><span></span>被攻击地址</h3>
							<table id="topNAdip">
								<thead>
									<tr><th>IP</th><th>关联IP数</th><th>国家</th></tr>
								</thead>
								<tbody></tbody>
							</table>
						</div>-->
          <div class="tab-table">
            <h3><span></span>攻击来源</h3>
            <table id="topNCountry">
              <thead>
                <tr>
                  <th>国家/省</th>
                  <th>攻击次数</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in attackSource" :key="index">
                  <td>
                    <span class="flag"
                      ><span :class="`flag_${item[0]}`"></span
                      >{{ worldCountryZH[item[0]] }}</span
                    >
                  </td>
                  <td>{{ item[1] }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 十大攻击类型 -->
        <div
          class="tab-pane tabHih"
          :class="activeTable === 'tenType' ? 'active' : ''"
          id="topNTabPane1"
        >
          <div class="tab-table">
            <h3><span></span>攻击源</h3>
            <table id="topNAsip">
              <thead>
                <tr>
                  <th>地址/类型</th>
                  <th>攻击次数</th>
                  <th>国家</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in tenTypeData" :key="index">
                  <td>{{ item.attackType }}</td>
                  <td>{{ item.attackTimes }}</td>
                  <td>
                    <span class="flag"> --</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 今日访问 -->
        <div
          class="tab-pane tabHih"
          :class="activeTable === 'todayAccess' ? 'active' : ''"
          id="topNTabPane2"
        >
          <div class="tab-table">
            <h3><span></span>IP列表</h3>
            <table id="topNReqip">
              <thead>
                <tr>
                  <th>源IP地址</th>
                  <th>请求/攻击数</th>
                  <th>国家</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in todayAccessData" :key="index">
                  <td>{{ item.ip }}</td>
                  <td>{{ item.requests }}/{{ item.attacks }}</td>
                  <td>
                    <span class="flag" :title="item.asregdetail">
                      <span :class="`flag_${item.ascountry}`"></span
                      >{{ item.asregdetail }}</span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
            <!--	<table id="topNResip">
								<thead>
									<tr><th>目的IP</th><th>关联IP数</th></tr>
								</thead>
								<tbody></tbody>
							</table>-->
          </div>
          <!--	<div class="tab-table">
							<h3><span></span>DGA检测</h3>
							<table id="topDGA">
								<thead>
									<tr><th>域名</th><th>查询次数</th></tr>
								</thead>
								<tbody></tbody>
							</table>
						</div>
						<div class="tab-table">
							<h3><span></span>未知文件-攻击源地址</h3>
							<table id="topNAsipFile">
								<thead>
									<tr><th>地址</th><th>攻击次数</th><th>国家</th></tr>
								</thead>
								<tbody></tbody>
							</table>
						</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTenSource, getTenType, getTodayAccess } from '/src/api/screen'
import { worldCountryZH } from './data'
export default {
  name: 'EventSide',
  data() {
    return {
      // 当前活跃的列表  tenSource: 十大攻击源; tenType: 十大攻击类型; todayAccess: 今日访问
      activeTable: 'tenSource',
      worldCountryZH: worldCountryZH,
      tenSourceData: [],
      attackSource: [],
      tenTypeData: [],
      todayAccessData: [],
    }
  },
  methods: {
    convertTenSource(data) {
      const map = new Map()
      for (let item of data) {
        if (map.has(item.ascountry)) {
          map.set(item.ascountry, map.get(item.ascountry) + item.attackTimes)
        } else {
          map.set(item.ascountry, item.attackTimes)
        }
      }
      const res = Array.from(map).sort((a, b) => b[1] - a[1])
      return res
    },
  },
  mounted() {
    getTenSource().then(({ data }) => {
      this.tenSourceData = data
      this.attackSource = this.convertTenSource(data)
    })
    getTenType().then(({ data }) => (this.tenTypeData = data))
    getTodayAccess().then(({ data }) => (this.todayAccessData = data))
  },
}
</script>

<style>
@import url(./css/flag.css);
.event-side {
  position: absolute;
  z-index: 9999;
  top: 60px;
  right: 30px;
  width: 320px;
  height: 100%;
  transition: right 0.5s ease 0s;
  background: url(~/src/assets/images/page/leftcut.png) no-repeat left bottom
    #12294e scroll;
  padding: 10px;
}
#nav-tabs-prime {
  height: 35px;
  list-style: none;
  border-top: none;
  border-bottom: none;
  background: none;
}
#nav-tabs-prime li {
  float: left;
  font-size: 14px;
  width: 96px;
  margin-right: 6px;
  margin-bottom: 0px;
  height: 35px;
  line-height: 35px;
  border-right: none;
  border-bottom: none;
  background-color: #34548a;
}
#nav-tabs-prime > li > a {
  line-height: 35px;
  color: #aab5d4;
  margin: 0px;
  padding: 0px;
  border: none;
  text-align: center;
  border-radius: 0px;
}
#nav-tabs-prime li:hover a,
#nav-tabs-prime li.active a {
  color: #fff;
  border: none;
  font-weight: normal;
  line-height: 35px;
  background-color: #008cff;
}
#nav-tabs-prime li:last-child {
  margin-right: 0px;
}
#nav-tabs-prime li:first-child a {
  background: linear-gradient(135deg, #12294e 5px, #34548a 0);
}
#nav-tabs-prime li.active:first-child a,
#nav-tabs-prime li:hover:first-child a {
  background: linear-gradient(135deg, #12294e 5px, #008cff 0);
}
.tab-content,
.event-top-list {
  position: relative;
}
.tab-content > span,
.event-top-list > span {
  position: absolute;
  padding: 5px;
  border-style: solid;
  border-color: #73aefe;
}
.rowd1 {
  border-width: 2px 0 0 2px;
  top: 0px;
  left: 0px;
}
.rowd2 {
  border-width: 2px 2px 0 0;
  top: 0px;
  right: 0px;
}
.col1 {
  border-width: 0 0 2px 2px;
  bottom: 0px;
  left: 0px;
}
.col2 {
  border-width: 0 2px 2px 0;
  bottom: 0px;
  right: 0px;
}
.event-side-con .asset-des2 > h3 {
  font-size: 12px;
  color: #ff7200;
  height: 25px;
  line-height: 25px;
  margin: 0px;
  padding: 0px;
  text-indent: 0px;
}
.event-side-con .asset-des2 p {
  font-size: 12px;
  color: #399bfe;
  height: 25px;
  line-height: 25px;
  margin: 0px;
  padding: 0px;
  text-indent: 0px;
  font-weight: bold;
}
.tab-content .tab-pane h3 {
  font-size: 16px;
  color: #333;
  font-weight: 600;
  position: relative;
  height: 25px;
  line-height: 25px;
  font-size: 14px;
  color: #399bfe;
  margin: 8px 0px 0px;
}
.tab-table table {
  margin: 0 auto;
  clear: both;
  width: 100%;
  color: #97c8f9;
  font-size: 12px;
  word-break: break-all;
  word-wrap: break-word;
  background: none;
}
.tab-table h3 span {
  display: inline-block;
  width: 7px;
  height: 7px;
  background: #399bfe;
  vertical-align: 1px;
  margin: 0px 5px;
}
.tab-table table tr {
  height: 30px;
  line-height: 27px;
  margin-bottom: 5px;
}
.tab-table table th {
  color: #aab5d4;
  background: none;
  text-align: left;
  text-indent: 10px;
  min-width: 75px;
}
.tab-table td {
  text-align: left;
  text-indent: 10px;
  background: #141e34;
  background-image: initial;
  background-position-x: initial;
  background-position-y: initial;
  background-size: initial;
  background-repeat-x: initial;
  background-repeat-y: initial;
  background-attachment: initial;
  background-origin: initial;
  background-clip: initial;
  background-color: rgb(20, 30, 52);
}
.tab-table table tr:hover td {
  background-color: #076fcb;
}
.tab-table td:nth-child(2) {
  color: #ff7200;
}
#event-side-con .row {
  margin: 0px;
}
#event-side-con .tab-content {
  width: 100%;
  margin-top: 5px;
  margin-bottom: 0px;
  padding: 0px 0px;
  background: url(~/src/assets/images/page/bg4.png) repeat scroll;
  overflow-x: auto;
}
@media only screen and (min-height: 450px) {
  /*>=450px height*/
  .event-side {
    height: 260px;
  }
  .tabHih {
    height: 200px;
    overflow-x: auto;
  }
}
@media only screen and (min-height: 550px) {
  /*>=550px height*/
  .event-side {
    height: 360px;
  }
  .tabHih {
    height: 300px;
    overflow-x: auto;
  }
}
@media only screen and (min-height: 650px) {
  /*>=650px height*/
  .event-side {
    height: 460px;
  }
  .tabHih {
    height: 400px;
    overflow-x: auto;
  }
}
@media only screen and (min-height: 750px) {
  /*>=750px height*/
  .event-side {
    height: 710px;
  }
  .tabHih {
    height: 650px;
    overflow-x: auto;
  }
}
</style>
