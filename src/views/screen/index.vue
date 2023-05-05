<template>
  <div class="homepage">
    <!-- <a @click="$router.back(-1)">
      <div class="goback">返回</div>
    </a> -->
    <!-- <div class="logo"><Logo :collapse="false" /></div> -->

    <div id="header" class="container" />
    <div
      style="
        position: absolute;
        z-index: 9999;
        top: 80px;
        left: 50%;
        margin-left: -70px;
      "
    >
      <div class="mapchoose">
        <span
          :class="currentMap === 'world' ? 'current' : ''"
          style="border-radius: 20px 0 0 20px"
          @click="switchMap('world')"
          >全球</span
        >
        <span
          :class="currentMap === 'china' ? 'current' : ''"
          style="border-radius: 0 20px 20px 0"
          @click="switchMap('china')"
          >中国</span
        >
        <span
          id="provinceSpan"
          style="display: none; border-radius: 0 20px 20px 0"
        />
      </div>
    </div>
    <div class="wrapper">
      <UnfoldMap ref="unfoldmap" />
      <Menu />

      <EventTop />

      <!-- <div style="position: absolute; z-index: 9999; top: 85px; left: 95px">
        <div id="timechoose" class="timechoose">
          <input
            class="current"
            type="button"
            value="当天"
            style="border-radius: 2px 0px 0px 2px"
          ></input>
          <input
            type="button"
            value="一周"
            style="border-radius: 0px 2px 2px 0px"
          ></input>
        </div>
        <div id="nowTime1" style="color: #a6cddc; font-size: 12px"></div>
      </div> -->

      <a
        id="Pinchcut"
        :class="showEventSide ? 'Pinchcut2' : 'Pinchcut1'"
        data-attr="Pinchlf"
        href="javascript: void(0);"
        @click="() => (showEventSide = !showEventSide)"
      />
      <EventSide v-if="showEventSide" />

      <EventBottom />
    </div>
  </div>
</template>

<script>
import UnfoldMap from './components/UnfoldMap'
import EventBottom from './components/EventBottom'
import EventSide from './components/EventSide'
import EventTop from './components/EventTop'
import Menu from './components/Menu'
// import Logo from '/src/layout/components/NavLeft/Logo'
export default {
  components: {
    UnfoldMap,
    EventBottom,
    EventSide,
    EventTop,
    Menu,
    // Logo,
  },
  data() {
    return {
      showEventSide: true,
      currentMap: 'world',
    }
  },
  methods: {
    switchSideEvent() {
      this.showEventSide = !this.showEventSide
    },
    switchMap(map) {
      this.currentMap = map
      this.$refs.unfoldmap.getWorldConfig(map)
    },
  },
}
</script>
<style scoped>
@import url(/src/styles/bootstrap.css);
/* 大屏组件的全局样式 */
body {
  font-family: Microsoft YaHei, Times New Roman;
}
a {
  outline: none;
  text-decoration: none;
}
a:hover,
a:focus {
  outline: none;
  text-decoration: none;
  outline-offset: 0;
}
a:active {
  star: expression(this.onFocus=this.blur());
}
button,
input[type='button'] {
  border: none;
}
ul li {
  list-style: none;
}
em {
  font-style: normal;
}
pre {
  white-space: pre-wrap; /* css-3 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
  background-color: #fff;
  border: none;
  border-radius: none;
  padding: 5px;
  margin: 0px;
}
hr {
  width: 100%;
  margin: 15px 0px 15px 0px;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.container {
  width: 100%;
  min-width: 995px;
}
</style>

<style lang="scss">
.homepage,
.homepage-map,
.page-map {
  overflow: hidden;
  width: 100%;
  height: 100%;
  min-width: 40pc;
  font-size: 9pt;
  font-family: Microsoft YaHei, sans-serif;
  font-smooth: always;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-font-smoothing: antialiased;
  -moz-font-smoothing: antialiased;
  font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.homepage {
  min-width: 1000px;
  color: #fafbff;
  background: #2a4264;
  width: 100%;
  height: 100%;
}
#header {
  position: relative;
  z-index: 19999;
}
.wrapper {
  height: 100%;
}
.timechoose {
  text-align: right;
  margin-bottom: 10px;
  display: inline-block;
  border: 1px solid #465a71;
  border-radius: 2px;
}
.timechoose input[type='button'] {
  width: 60px;
  height: 26px;
  line-height: 26px;
  font-size: 14px;
  color: #6a7a97;
  background: none;
  border-radius: none;
  cursor: pointer;
}
.timechoose input.current,
.timechoose input:hover {
  color: #fff;
  background: #06a5a3;
}
/*中国地图*/
.mapchoose span {
  display: inline-block;
  width: 70px;
  height: 26px;
  line-height: 26px;
  font-size: 14px;
  color: #58627d;
  background: #172a49;
  text-align: center;
  cursor: pointer;
  font-weight: bold;
}
.mapchoose span.current,
.mapchoose span:hover {
  background: #446cff;
  color: #fff;
}
.Pinchcut1,
.Pinchcut2 {
  position: absolute;
  z-index: 9999;
  top: 60px;
  right: 0px;
  width: 22px;
  height: 35px;
  display: inline-block;
  background: url(~/src/assets/images/page/leftcut1.jpg) no-repeat scroll 50%
    50%;
}
.Pinchcut1:hover {
  width: 27px;
  transition: left 0.5s ease 0s;
  background: url(~/src/assets/images/page/leftcut1h.jpg) no-repeat scroll 50%
    50%;
}
.Pinchcut2 {
  width: 27px;
  background: url(~/src/assets/images/page/leftcut2.jpg) no-repeat scroll 50%
    50%;
}
.Pinchcut2:hover {
  width: 27px;
  background: url(~/src/assets/images/page/leftcut2h.jpg) no-repeat scroll 50%
    50%;
}
.goback {
  width: 70px;
  height: 26px;
  background-color: rgb(42, 66, 100);
  position: absolute;
  top: 10px;
  left: 5px;
  color: #cbe5ff;
  font-size: 14px;
  text-align: center;
  line-height: 26px;
  border: 1px solid #cbe5ff;
  z-index: 9999;
  background-color: #172a49;
}
.goback:hover {
  background-color: #06a5a3;
  color: #fff;
}
.logo {
  width: 200px;
  height: 26px;
  position: absolute;
  z-index: 9999;
}
</style>
