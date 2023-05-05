<template>
  <div class="event-top">
    <div class="event-top-list" id="event-top-list01" style="width: 570px">
      <span class="rowd rowd1"></span>
      <span class="rowd rowd2"></span>
      <span class="col col2"></span>
      <span class="col col1"></span>
      <h6>
        攻击信息
        <span
          id="event-list01"
          class="fr"
          :class="showAttackInfo ? 'icon-list-down' : 'icon-list-up'"
          @click="() => (showAttackInfo = !showAttackInfo)"
        >
        </span>
      </h6>
      <ol id="event-des01" v-if="showAttackInfo">
        <li class="disc10" onclick="jumpWarn(1);">
          攻击总数<span id="s1Total">{{
            totalAttack == undefined ? '--' : totalAttack
          }}</span>
        </li>
        <li class="disc10" onclick="jumpWarn(2);">
          高危数量<span id="s2Total">{{
            highRisk == undefined ? '--' : highRisk
          }}</span>
        </li>
        <li class="disc10" onclick="jumpWarn(3);">
          IP封禁<span id="s3Total">{{
            ipBlocked == undefined ? '--' : ipBlocked
          }}</span>
        </li>
        <li class="disc10" onclick="jumpWarn(4);">
          攻击国家<span id="s4Total">{{
            attackCountry == undefined ? '--' : attackCountry
          }}</span>
        </li>
        <li class="disc10" onclick="jumpWarn(5);">
          访问流量<span id="s5Total">{{
            accessTranffic == undefined ? '--' : convertTranffic(accessTranffic)
          }}</span>
        </li>
        <li class="disc10" onclick="jumpWarn(6);">
          IP总数<span id="s6Total">{{
            ipTotal == undefined ? '--' : ipTotal
          }}</span>
        </li>
      </ol>
    </div>
    <br />

    <!--<div class="event-top-list" id="event-top-list02" style="width:570px;">
				<span class="rowd rowd1"></span>
				<span class="rowd rowd2"></span>
				<span class="col col2"></span>
				<span class="col col1"></span>
				<h6>远程控制<span id="event-list02" class="icon-list-down fr"></span></h6>
				<ol id="event-des02">
					<li style="list-style-image:url(../../images/page/disc9.png);" onclick="jumpWarn(7);">主机控制行为<span id="s7Total">--</span></li>
					<li style="list-style-image:url(../../images/page/disc9.png);" onclick="jumpWarn(6);">网站控制行为<span id="s6Total">--</span></li>
					<li style="list-style-image:url(../../images/page/disc9.png);" onclick="jumpWarn(1);">异常IP数<span id="s3Total">--</span></li>
				</ol>
			</div>
			<br>-->

    <div class="event-top-list" id="event-top-list03" style="width: 570px">
      <span class="rowd rowd1"></span>
      <span class="rowd rowd2"></span>
      <span class="col col2"></span>
      <span class="col col1"></span>
      <h6>
        系统状态
        <span
          id="event-list03"
          class="fr"
          :class="showSystemStatus ? 'icon-list-down' : 'icon-list-up'"
          @click="() => (showSystemStatus = !showSystemStatus)"
        ></span>
      </h6>
      <ol id="event-des03" v-if="showSystemStatus">
        <li class="disc8" onclick="jumpWarn(7);">
          CPU占比<span id="s7Total">{{
            cpuPercent == undefined ? '--' : cpuPercent + '%'
          }}</span>
        </li>
        <li class="disc8" onclick="jumpWarn(8);">
          内存占比<span id="s8Total">{{
            memoryPercent == undefined ? '--' : memoryPercent + '%'
          }}</span>
        </li>
        <li class="disc8" onclick="jumpWarn(9);">
          磁盘占比<span id="s9Total">{{
            diskPercent == undefined ? '--' : diskPercent + '%'
          }}</span>
        </li>
        <li class="disc8" onclick="jumpWarn(10);">
          服务器数<span id="s10Total">{{
            serverNumber == undefined ? '--' : serverNumber
          }}</span>
        </li>
        <li class="disc8" onclick="jumpWarn(11);">
          规则数量<span id="s11Total">{{
            ruleNumber == undefined ? '--' : ruleNumber
          }}</span>
        </li>
        <li class="disc8" onclick="jumpWarn(12);">
          工作状态<span id="s12Total"
            ><font :color="workStatusColor">{{ workStatus }}</font></span
          >
        </li>
      </ol>
    </div>
  </div>
</template>

<script>
import { getAttackInfo, getSystemStatus } from '/src/api/screen'
export default {
  data() {
    return {
      showAttackInfo: true,
      showSystemStatus: true,
      attackInfo: {},
      systemStatus: {},
    }
  },
  computed: {
    totalAttack() {
      return this.attackInfo.totalAttack
    },
    highRisk() {
      return this.attackInfo.highRisk
    },
    ipBlocked() {
      return this.attackInfo.ipBlocked
    },
    attackCountry() {
      return this.attackInfo.attackCountry
    },
    accessTranffic() {
      return this.attackInfo.accessTranffic
    },
    ipTotal() {
      return this.attackInfo.ipTotal
    },
    cpuPercent() {
      return this.systemStatus.cpuPercent
    },
    memoryPercent() {
      return this.systemStatus.memoryPercent
    },
    diskPercent() {
      return this.systemStatus.diskPercent
    },
    serverNumber() {
      return this.systemStatus.serverNumber
    },
    ruleNumber() {
      return this.systemStatus.ruleNumber
    },
    workStatusColor() {
      return this.systemStatus.workStatus ? 'read' : 'red' // read为绿色， red为红色
    },
    workStatus() {
      return this.systemStatus.workStatus ? '正常' : '异常'
    },
  },
  methods: {
    convertTranffic(tranfficMB) {
      if (typeof tranfficMB !== 'number') {
        return '--'
      }
      if (tranfficMB >= 1024) {
        return (tranfficMB / 1024).toFixed(2) + 'G'
      }
      return tranfficMB + 'M'
    },
  },
  mounted() {
    getAttackInfo().then((data) => {
      console.log('debug | attackInfo', data)
      this.attackInfo = data.data
    })
    getSystemStatus().then((data) => {
      console.log('debug | systemInfo', data)
      this.systemStatus = data.data
    })
  },
}
</script>

<style>
.event-top {
  position: absolute;
  z-index: 9999;
  bottom: 180px;
  left: 0px;
}
.event-top-list {
  float: left;
  margin-right: 5px;
  background: url(~/src/assets/images/page/bg5.png) repeat scroll;
}
.event-top-list h6 {
  font-size: 14px;
  color: #399bfe;
  height: 35px;
  line-height: 35px;
  padding: 0px 15px;
  margin: 0px;
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
.icon-list-up {
  background: url(~/src/assets/images/page/icon-list-up.png) no-repeat scroll
    50% 50%;
  width: 10px;
  height: 17px;
  margin: 9px 0px;
  cursor: pointer;
  display: inline-block;
}
.event-top-list ol {
  list-style: none;
  margin: 0px;
  padding: 0px;
  padding: 0px 0px 0px 30px;
}
.event-top-list ol li {
  width: 180px;
  font-size: 13px;
  list-style-type: disc;
  /* list-style-image:url(~/src/assets/images/page/disc1.png); */
  color: #cbe5ff;
  height: 35px;
  line-height: 35px;
  padding-right: 10px;
  cursor: pointer;
}
.event-top-list ol li span {
  padding-left: 15px;
  color: #ff7200;
  font-size: 16px;
  font-weight: bold;
  display: inline-block;
  height: 35px;
  line-height: 35px;
}
.event-top-list ol li:hover {
  color: #399bfe;
}
.event-top-list ol li:hover span {
  color: #399bfe;
}
#event-top-list01 ol li,
#event-top-list03 ol li {
  float: left;
}
.disc8 {
  list-style-image: url(~/src/assets/images/page/disc8.png);
}
.disc10 {
  list-style-image: url(~/src/assets/images/page/disc8.png);
}
</style>
