<template>
  <div>
    <q-breadcrumb :data="['设备管理', '发送功能指令']" />
    <el-row>
      <h1 class="m10">第一步：选择ProductKey</h1>
      <el-radio-group class="m10" v-model="productKey">
        <el-radio-button :label="item.key" v-for="(item, index) in productKeyList" :key="index">{{ item.name }}</el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row>
      <h1 class="m10">第二步：输入IMEI号</h1>
      <el-input class="m10" v-model="imei" placeholder="IMEI" style="width: 50%"></el-input>
    </el-row>
    <el-row>
      <h1 class="m10">第三步：选择topic</h1>
      <el-radio-group class="m10" v-model="topic">
        <el-radio-button :label="item" v-for="(item, index) in codeModel.topicList" :key="index"></el-radio-button>
      </el-radio-group>
    </el-row>
    <el-row>
      <!-- 有方串口指令 -->
      <template v-if="topic === 'cmd'">
        <el-row>
          <h1 class="m10">发送串口指令</h1>
        </el-row>
        <!-- 型号 -->
        <el-row>
          <h1 class="m10">选择机器型号</h1>
          <div class="m10">
            <el-select v-model="machine" value-key="code" placeholder="选择型号" style="width: 80%">
              <el-option v-for="(item, index) in codeModel.modelList" :key="index" :label="`【${item.pname}】【${item.code}】${item.title}`" :value="item">
              </el-option>
            </el-select>
          </div>
        </el-row>
        <!-- 功能 -->
        <el-row v-if="machine && machine.cmdList && machine.cmdList.length > 0">
          <h1 class="m10">选择功能</h1>
          <div class="m10">
            <el-select v-model="command" value-key="cmdCode" placeholder="选择指令" style="width: 80%">
              <el-option v-for="(item, index) in machine.cmdList" :key="index" :label="`【${item.cmdCode}】${item.name}${item.params ? '【参1】' : ''}${item.params1 ? '【参2】' : ''}${item.callback ? '【CB】' : ''}`" :value="item">
              </el-option>
            </el-select>
          </div>
          <template v-if="command">
            <div class="m10">
              <el-input v-if="command.params" v-model="params" placeholder="参数1" style="width: 50%"></el-input>
              <el-input v-if="command.params1" v-model="params1" placeholder="参数2" style="width: 25%"></el-input>
              <el-input v-if="command.params2" v-model="params2" placeholder="参数3" style="width: 25%"></el-input>
            </div>
            <p class="m10 f12">说明：{{ command.desc }}</p>
          </template>
        </el-row>
      </template>
      <!-- 有方脉冲指令 -->
      <template v-else-if="topic === 'control'">
        <el-row>
          <h1 class="m10">发送脉冲指令</h1>
        </el-row>
        <el-row>
          <div class="m10">
            <el-input-number v-model="impulseNum" :min="1" :max="100" label="脉冲数"></el-input-number>
          </div>
        </el-row>
      </template>
      <!-- 有方脉冲设置 -->
      <template v-else-if="topic === 'setsignal'">
        <el-row>
          <h1 class="m10">设置模块脉冲</h1>
        </el-row>
        <el-row>
          <div class="m10">
            <el-input-number v-model="impulseWidth" :min="1" :max="100" label="脉冲宽度（范围1-100）"></el-input-number>
            <el-input-number v-model="impulseSpace" :min="1" :max="1000" label="脉冲间隔（范围1-1000）"></el-input-number>
          </div>
        </el-row>
      </template>
    </el-row>
    <el-row>
      <p class="m10">fullName: {{ productKey }} / {{ imei }} / {{ topic }}</p>
      <p class="m10" v-if="machine">code: {{ machine.code }}</p>
      <p class="m10" v-if="command">{{ command.cmdCode }} / {{ command.params }} / {{ command.params1 }} / {{ command.callback ? '是' : '否'}}</p>
      <p class="m10" v-if="resp">返回值：{{ JSON.stringify(resp) }}</p>
    </el-row>
    <el-button class="m10" type="primary" @click="handleSubmit">发送指令</el-button>
  </div>
</template>

<script>
/**
 * 指令发送界面
 */
import QBreadcrumb from "@/components/Breadcrumb";
import Api from "@/utils/Api";

// 指令表
// 有方
const YoufangCodeModel = {
  topicList: ["cmd", "control", "setsignal"],
  modelList: [
    {
      code: "00,00",
      title: "海尔SXB60—51U7/SXB70-51U7",
      pname: "00洗衣机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "01,00",
          name: "查询设备状态",
          desc: "查询设备状态",
          callback: true
        },
        {
          cmdCode: "01,01",
          name: "查询报警状态",
          desc: "查询报警状态",
          callback: true
        },
        {
          cmdCode: "03,00",
          name: "数字显示",
          desc:
            '数字显示, 参数1: 显示8996数字 如"8, 9, 9, 6" (int[4] {8,9,9,6}) ',
          params: true
        },
        {
          cmdCode: "03,01",
          name: "洗涤水位设置",
          desc:
            '洗涤水位设置, { "00", 1 }，00表示：洗涤，1/2/3/4表示：极低/低/中/高水位 ',
          params: true,
          params1: true
        },
        {
          cmdCode: "03,02",
          name: "洗涤时间设置",
          desc:
            '洗涤时间设置, { "00", 10}，00表示：“标准高水位洗涤” 01表示：“大物高水位洗涤” 02表示：“快速高水位洗涤”，10表示：“10分钟” ',
          params: true,
          params1: true
        },
        {
          cmdCode: "03,03",
          name: "洗涤次数设置",
          desc:
            "洗涤次数设置, 00表示：标准程序增加蓄水漂洗次数，2表示：2次 3表示：3次”",
          params: true,
          params1: true
        },
        {
          cmdCode: "03,04",
          name: "线下洗衣模式设置",
          desc:
            "线下洗衣模式设置, 00表示：标准洗，01表示：大物洗, 02表示：快速洗, 03表示：单脱水, 1表示：开启（0表示关闭）",
          params: true,
          params1: true
        },
        {
          cmdCode: "03,05",
          name: "洗衣脉冲设置",
          desc:
            '洗衣脉冲设置, { "00", 15 }，00表示：标准洗，01表示：大物洗, 02表示：快速洗, 03表示：单脱水, 15表示：15个脉冲 ',
          params: true,
          params1: true
        },
        { cmdCode: "04,01", name: "暂停", desc: "暂停" },
        { cmdCode: "04,02", name: "暂停启动", desc: "暂停启动" },
        { cmdCode: "04,03", name: "复位", desc: "复位" },
        { cmdCode: "05,00", name: "启动筒自洁", desc: "启动筒自洁" },
        { cmdCode: "05,01", name: "启动单脱", desc: "启动单脱" },
        { cmdCode: "05,02", name: "启动快速洗", desc: "启动快速洗" },
        { cmdCode: "05,03", name: "启动标准洗", desc: "启动标准洗" },
        { cmdCode: "05,04", name: "启动大物洗", desc: "启动大物洗" },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "00-04" 参数2离线码"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "00,01",
      title: "海尔8公斤滚筒洗衣机:SXG80-BX10266AU7",
      pname: "00洗衣机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "01,00",
          name: "查询设备状态",
          desc: "查询设备状态",
          callback: true
        },
        {
          cmdCode: "01,01",
          name: "查询报警状态",
          desc: "查询报警状态",
          callback: true
        },
        {
          cmdCode: "03,00",
          name: "数字显示",
          desc:
            '数字显示, 参数1: 显示8996数字 如"8, 9, 9, 6" (int[4] {8,9,9,6}) ',
          params: true
        },
        {
          cmdCode: "03,01",
          name: "洗涤水位设置",
          desc:
            '洗涤水位设置, { "00", 1 }，00表示：洗涤，1/2/3/4表示：极低/低/中/高水位 ',
          params: true,
          params1: true
        },
        {
          cmdCode: "03,02",
          name: "洗涤时间设置",
          desc:
            '洗涤时间设置, { "00", 10}，00表示：“标准高水位洗涤” 01表示：“大物高水位洗涤” 02表示：“快速高水位洗涤”，10表示：“10分钟” ',
          params: true,
          params1: true
        },
        {
          cmdCode: "03,05",
          name: "洗衣脉冲设置",
          desc:
            '洗衣脉冲设置, { "04", 15 }，04表示：普通混合（标准），05表示：白色特脏（脏污）, 06表示：混纺尼龙（大物）, 07表示：精致衣服（轻柔）, 08表示：加强洗, 09表示：超净漂洗, 03表示：单脱水, 15表示：15个脉冲 ',
          params: true,
          params1: true
        },
        {
          cmdCode: "03,06",
          name: "特殊功能设置",
          desc:
            '特殊功能设置, { "00", 1 }，00表示：加热功能，01表示：刷卡投币功能, 1表示：开启（0表示关闭）',
          params: true,
          params1: true
        },
        { cmdCode: "04,03", name: "复位", desc: "复位" },
        { cmdCode: "05,00", name: "启动筒自洁", desc: "启动筒自洁" },
        { cmdCode: "05,01", name: "启动单脱", desc: "启动单脱" },
        {
          cmdCode: "05,06",
          name: "普通混合（标准）",
          desc: "普通混合（标准）"
        },
        {
          cmdCode: "05,07",
          name: "普通混合（标准）+加强洗",
          desc: "普通混合（标准）+加强洗"
        },
        {
          cmdCode: "05,08",
          name: "普通混合（标准）+超净漂洗",
          desc: "普通混合（标准）+超净漂洗"
        },
        {
          cmdCode: "05,09",
          name: "普通混合（标准）+加强洗+超净漂洗",
          desc: "普通混合（标准）+加强洗+超净漂洗"
        },
        {
          cmdCode: "05,0A",
          name: "白色特脏（脏污）",
          desc: "白色特脏（脏污）"
        },
        {
          cmdCode: "05,0B",
          name: "白色特脏（脏污）+加强洗",
          desc: "白色特脏（脏污）+加强洗"
        },
        {
          cmdCode: "05,0C",
          name: "白色特脏（脏污）+超净漂洗",
          desc: "白色特脏（脏污）+超净漂洗"
        },
        {
          cmdCode: "05,0D",
          name: "白色特脏（脏污）+加强洗+超净漂洗",
          desc: "白色特脏（脏污）+加强洗+超净漂洗"
        },
        {
          cmdCode: "05,0E",
          name: "混纺尼龙（大物）",
          desc: "混纺尼龙（大物）"
        },
        {
          cmdCode: "05,0F",
          name: "混纺尼龙（大物）+加强洗",
          desc: "混纺尼龙（大物）+加强洗"
        },
        {
          cmdCode: "05,10",
          name: "混纺尼龙（大物）+超净漂洗",
          desc: "混纺尼龙（大物）+超净漂洗"
        },
        {
          cmdCode: "05,11",
          name: "混纺尼龙（大物）+加强洗+超净漂洗",
          desc: "混纺尼龙（大物）+加强洗+超净漂洗"
        },
        {
          cmdCode: "05,12",
          name: "精致衣服（轻柔）",
          desc: "精致衣服（轻柔）"
        },
        {
          cmdCode: "05,13",
          name: "精致衣服（轻柔）+超净漂洗",
          desc: "精致衣服（轻柔）+超净漂洗"
        },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "00-13" 参数2离线码"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "00,02",
      title: "海尔6kg智慧波轮洗衣机：SXB60-1U1",
      pname: "00洗衣机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "01,00",
          name: "查询设备状态",
          desc: "查询设备状态",
          callback: true
        },
        {
          cmdCode: "01,01",
          name: "查询报警状态",
          desc: "查询报警状态",
          callback: true
        },
        {
          cmdCode: "03,00",
          name: "数字显示",
          desc:
            '数字显示, 参数1: 显示8996数字 如"8, 9, 9, 6" (int[4] {8,9,9,6}) ',
          params: true
        },
        {
          cmdCode: "03,01",
          name: "洗涤水位设置",
          desc:
            '洗涤水位设置, { "00", 1 }，00表示：洗涤，1/2/3/4表示：极低/低/中/高水位 ',
          params: true,
          params1: true
        },
        {
          cmdCode: "03,02",
          name: "洗涤时间设置",
          desc:
            '洗涤时间设置, { "00", 10}，00表示：“标准高水位洗涤” 01表示：“大物高水位洗涤” 02表示：“快速高水位洗涤”，10表示：“10分钟” ',
          params: true,
          params1: true
        },
        {
          cmdCode: "03,03",
          name: "洗涤次数设置",
          desc:
            "洗涤次数设置, 00表示：标准程序增加蓄水漂洗次数，2表示：2次 3表示：3次”",
          params: true,
          params1: true
        },
        { cmdCode: "04,01", name: "暂停", desc: "暂停" },
        { cmdCode: "04,02", name: "暂停启动", desc: "暂停启动" },
        { cmdCode: "04,03", name: "复位", desc: "复位" },
        { cmdCode: "05,00", name: "启动筒自洁", desc: "启动筒自洁" },
        { cmdCode: "05,01", name: "启动单脱", desc: "启动单脱" },
        { cmdCode: "05,02", name: "启动快速洗", desc: "启动快速洗" },
        { cmdCode: "05,03", name: "启动标准洗", desc: "启动标准洗" },
        { cmdCode: "05,04", name: "启动大物洗", desc: "启动大物洗" },
        { cmdCode: "05,14", name: "启动标准洗+杀菌", desc: "启动标准洗+杀菌" },
        { cmdCode: "05,15", name: "启动大物洗+杀菌", desc: "启动大物洗+杀菌" },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "00-04 14-15" 参数2离线码"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "00,03",
      title: "海尔波轮6公斤洗衣机:SXB60-1TU7",
      pname: "00洗衣机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "01,00",
          name: "查询设备状态",
          desc: "查询设备状态",
          callback: true
        },
        {
          cmdCode: "01,01",
          name: "查询报警状态",
          desc: "查询报警状态",
          callback: true
        },
        {
          cmdCode: "03,00",
          name: "数字显示",
          desc:
            '数字显示, 参数1: 显示8996数字 如"8, 9, 9, 6" (int[4] {8,9,9,6}) ',
          params: true
        },
        {
          cmdCode: "03,01",
          name: "洗涤水位设置",
          desc:
            '洗涤水位设置, { "00", 1 }，00表示：洗涤，1/2/3/4表示：极低/低/中/高水位 ',
          params: true,
          params1: true
        },
        {
          cmdCode: "03,02",
          name: "洗涤时间设置",
          desc:
            '洗涤时间设置, { "00", 10}，00表示：“标准高水位洗涤” 01表示：“大物高水位洗涤” 02表示：“快速高水位洗涤”，10表示：“10分钟” ',
          params: true,
          params1: true
        },
        {
          cmdCode: "03,03",
          name: "洗涤次数设置",
          desc:
            "洗涤次数设置, 00表示：标准程序增加蓄水漂洗次数，2表示：2次 3表示：3次”",
          params: true,
          params1: true
        },
        {
          cmdCode: "03,04",
          name: "线下洗衣模式设置",
          desc:
            "线下洗衣模式设置, 00表示：标准洗，01表示：大物洗, 02表示：快速洗, 03表示：单脱水, 1表示：开启（0表示关闭）",
          params: true,
          params1: true
        },
        {
          cmdCode: "03,05",
          name: "洗衣脉冲设置",
          desc:
            '洗衣脉冲设置, { "00", 15 }，00表示：标准洗，01表示：大物洗, 02表示：快速洗, 03表示：单脱水, 15表示：15个脉冲 ',
          params: true,
          params1: true
        },
        { cmdCode: "04,01", name: "暂停", desc: "暂停" },
        { cmdCode: "04,02", name: "暂停启动", desc: "暂停启动" },
        { cmdCode: "04,03", name: "复位", desc: "复位" },
        { cmdCode: "05,00", name: "启动筒自洁", desc: "启动筒自洁" },
        { cmdCode: "05,01", name: "启动单脱", desc: "启动单脱" },
        { cmdCode: "05,02", name: "启动快速洗", desc: "启动快速洗" },
        { cmdCode: "05,03", name: "启动标准洗", desc: "启动标准洗" },
        { cmdCode: "05,04", name: "启动大物洗", desc: "启动大物洗" },
        { cmdCode: "05,14", name: "启动标准洗+杀菌", desc: "启动标准洗+杀菌" },
        { cmdCode: "05,15", name: "启动大物洗+杀菌", desc: "启动大物洗+杀菌" },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "00-04 14-15" 参数2离线码"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "00,04",
      title: "富磊洗衣机（六公斤定制机）",
      pname: "00洗衣机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "01,00",
          name: "查询设备状态",
          desc: "查询设备状态",
          callback: true
        },
        {
          cmdCode: "03,02",
          name: "时间设置",
          desc:
            '时间参数格式："单脱时间[0..255],快速时间,标准时间,大物时间,液泵时间,加热快速时间,加热标准时间,加热大物时间" 如"10,10,40,10,10,10,10,10"',
          params: true
        },
        {
          cmdCode: "03,05",
          name: "价格设置",
          desc:
            '价格设置格式："单脱价格[0..255],快速价格,标准价格,大物价格,加热快速价格,加热标准价格,加热大物价格" 如"20,20,20,20,20,20,20"',
          params: true
        },
        {
          cmdCode: "03,06",
          name: "特殊功能",
          desc:
            '特殊功能参数格式："掉电记忆功能,全程半程保护功能,加热功能,桶清洁功能,按键使能,投币使能 1开启 0 关闭" 如"1,1,1,1,1,1"',
          params: true
        },
        {
          cmdCode: "03,07",
          name: "过程参数设置",
          desc:
            '过程参数设置格式："快速水位[0..255],标准水位,大物水位,脱水转速,温度" 如"20,20,20,20,20"',
          params: true
        },
        { cmdCode: "04,01", name: "暂停", desc: "暂停" },
        { cmdCode: "04,02", name: "暂停恢复启动", desc: "暂停恢复启动" },
        { cmdCode: "04,04", name: "结束", desc: "结束" },
        { cmdCode: "05,00", name: "启动筒自洁", desc: "启动筒自洁" },
        { cmdCode: "05,01", name: "启动单脱水", desc: "启动单脱水" },
        { cmdCode: "05,02", name: "启动快速洗", desc: "启动快速洗" },
        { cmdCode: "05,03", name: "启动标准洗", desc: "启动标准洗" },
        { cmdCode: "05,04", name: "启动大物洗", desc: "启动大物洗" },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "00"-筒自洁 01"-单脱 "02"-快速洗 "03"-标准洗 "04"-大物洗，参数2表示离线码，"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "00,05",
      title: "吉德共享洗衣机：GX-PJT",
      pname: "00洗衣机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "01,00",
          name: "查询设备状态",
          desc: "查询设备状态",
          callback: true
        },
        {
          cmdCode: "03,05",
          name: "价格设置",
          desc:
            '价格设置格式："标准洗价格,大件洗价格,加温洗价格,快洗价格,单脱水价格,洗衣液价格,洗涤加时价格" 如"5,5,5,5,5,5,5"',
          params: true
        },
        {
          cmdCode: "03,07",
          name: "过程参数设置",
          desc:
            '过程参数设置格式："标准洗时间,大件洗时间,加温洗时间,快洗时间,洗衣液泵时间,加热温度,是否允许筒清洁功能,是否允许洗衣液功能,是否允许断电记忆功能" 如"20,20,20,20,10,50,1,1,1"',
          params: true
        },
        {
          cmdCode: "04,00",
          name: "中途解锁（暂停状态下有效）",
          desc: "中途解锁（暂停状态下有效）"
        },
        { cmdCode: "04,01", name: "暂停", desc: "暂停" },
        { cmdCode: "04,02", name: "暂停恢复启动", desc: "暂停恢复启动" },
        { cmdCode: "04,04", name: "结束", desc: "结束" },
        {
          cmdCode: "05,00",
          name: "启动筒自洁",
          desc:
            '启动筒自洁 参数："洗涤加时时间,是否投放洗衣液,是否进行筒清洁" 如: "0,0,1"',
          params: true
        },
        {
          cmdCode: "05,01",
          name: "启动单脱水",
          desc:
            '启动单脱水 参数："洗涤加时时间,是否投放洗衣液,是否进行筒清洁" 如: "0,0,1"',
          params: true
        },
        {
          cmdCode: "05,02",
          name: "启动快速洗",
          desc:
            '启动快速洗 参数："洗涤加时时间,是否投放洗衣液,是否进行筒清洁" 如: "10,1,1"',
          params: true
        },
        {
          cmdCode: "05,03",
          name: "启动标准洗",
          desc:
            '启动标准洗 参数："洗涤加时时间,是否投放洗衣液,是否进行筒清洁" 如: "10,1,1"',
          params: true
        },
        {
          cmdCode: "05,04",
          name: "启动大物洗",
          desc:
            '启动大物洗 参数："洗涤加时时间,是否投放洗衣液,是否进行筒清洁" 如: "10,1,1"',
          params: true
        },
        {
          cmdCode: "05,05",
          name: "启动加温洗",
          desc:
            '启动加温洗 参数："洗涤加时时间,是否投放洗衣液,是否进行筒清洁" 如: "10,1,1"',
          params: true
        },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "00"-筒自洁 01"-单脱 "02"-快速洗 "03"-标准洗 "04"-大物洗，参数2 表示 功能参数 如"0,0,1", "10,1,1", 参数3表示离线码，"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true,
          params2: true
        }
      ]
    },
    {
      code: "00,06",
      title: "海尔8kg滚筒洗衣机(白色款)：SXG80-BX10636U7",
      pname: "00洗衣机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "01,00",
          name: "查询设备状态",
          desc: "查询设备状态",
          callback: true
        },
        {
          cmdCode: "01,01",
          name: "查询报警状态",
          desc: "查询报警状态",
          callback: true
        },
        {
          cmdCode: "03,00",
          name: "数字显示",
          desc:
            '数字显示, 参数1: 显示8996数字 如"8, 9, 9, 6" (int[4] {8,9,9,6}) ',
          params: true
        },
        {
          cmdCode: "03,01",
          name: "洗涤水位设置",
          desc:
            '洗涤水位设置, { "00", 10 }，00表示：洗涤水位设置，01表示：漂洗水位设置, 10：10L水位 ',
          params: true,
          params1: true
        },
        {
          cmdCode: "03,02",
          name: "洗涤时间设置",
          desc:
            '洗涤时间设置, { "06", 10}，06表示：“标准主洗时间” 07表示：“大物主洗时间” 08表示：“快速主洗时间” 04表示：“甩干时间”，10表示：“10分钟” ',
          params: true,
          params1: true
        },
        {
          cmdCode: "03,05",
          name: "洗衣脉冲设置",
          desc:
            '洗衣脉冲设置, { "00", 15 }，00表示：标准，01表示：大物, 02表示：快速, 03表示：单脱, 09表示：超净漂洗, 0A表示：40度, 0B表示：60度, 15表示：15个脉冲 ',
          params: true,
          params1: true
        },
        {
          cmdCode: "03,06",
          name: "特殊功能设置",
          desc:
            '特殊功能设置, { "00", 1 }，00表示：加热功能，01表示：刷卡投币功能, 1表示：开启（0表示关闭）',
          params: true,
          params1: true
        },
        { cmdCode: "04,03", name: "复位", desc: "复位" },
        { cmdCode: "05,00", name: "启动筒自洁", desc: "启动筒自洁" },
        { cmdCode: "05,01", name: "启动单脱", desc: "启动单脱" },
        { cmdCode: "05,02", name: "快速洗", desc: "快速洗" },
        { cmdCode: "05,03", name: "启动标准洗", desc: "启动标准洗" },
        { cmdCode: "05,04", name: "大物洗", desc: "大物洗" },
        { cmdCode: "05,16", name: "标准洗+超净漂洗", desc: "标准洗+超净漂洗" },
        { cmdCode: "05,17", name: "标准洗+40度", desc: "标准洗+40度" },
        { cmdCode: "05,18", name: "标准洗+60度", desc: "标准洗+60度" },
        {
          cmdCode: "05,19",
          name: "标准洗+超净漂洗+40度",
          desc: "标准洗+超净漂洗+40度"
        },
        {
          cmdCode: "05,1A",
          name: "标准洗+超净漂洗+60度",
          desc: "标准洗+超净漂洗+60度"
        },
        { cmdCode: "05,1B", name: "大物洗+超净漂洗", desc: "大物洗+超净漂洗" },
        { cmdCode: "05,1C", name: "大物洗+40度", desc: "大物洗+40度" },
        { cmdCode: "05,1D", name: "大物洗+60度", desc: "大物洗+60度" },
        {
          cmdCode: "05,1E",
          name: "大物洗+超净漂洗+40度",
          desc: "大物洗+超净漂洗+40度"
        },
        {
          cmdCode: "05,1F",
          name: "大物洗+超净漂洗+60度",
          desc: "大物洗+超净漂洗+60度"
        },
        { cmdCode: "05,20", name: "快速+超净漂洗", desc: "快速+超净漂洗" },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "00-20" 参数2离线码"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "00,07",
      title: "海尔智慧型13kg滚筒洗衣机：SXG131-HD5107U1",
      pname: "00洗衣机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "01,00",
          name: "查询设备状态",
          desc: "查询设备状态",
          callback: true
        },
        {
          cmdCode: "01,01",
          name: "查询报警状态",
          desc: "查询报警状态",
          callback: true
        },
        {
          cmdCode: "03,00",
          name: "数字显示",
          desc:
            '数字显示, 参数1: 显示8996数字 如"8, 9, 9, 6" (int[4] {8,9,9,6}) ',
          params: true
        },
        { cmdCode: "04,01", name: "暂停", desc: "暂停" },
        { cmdCode: "04,02", name: "暂停启动", desc: "暂停启动" },
        { cmdCode: "04,03", name: "复位", desc: "复位" },
        { cmdCode: "05,00", name: "启动筒自洁", desc: "启动筒自洁" },
        {
          cmdCode: "05,06",
          name: "普通混合（冷水）",
          desc: "普通混合（冷水）"
        },
        {
          cmdCode: "05,07",
          name: "普通混合（标准）+加强洗",
          desc: "普通混合（标准）+加强洗"
        },
        {
          cmdCode: "05,0A",
          name: "白色特脏（温水）",
          desc: "白色特脏（温水）"
        },
        {
          cmdCode: "05,0B",
          name: "白色特脏（温水）+加强洗",
          desc: "白色特脏（温水）+加强洗"
        },
        {
          cmdCode: "05,0E",
          name: "混纺尼龙（热水）",
          desc: "混纺尼龙（热水）"
        },
        {
          cmdCode: "05,0F",
          name: "混纺尼龙（热水）+加强洗",
          desc: "混纺尼龙（热水）+加强洗"
        },
        {
          cmdCode: "05,12",
          name: "精致衣服（轻柔）",
          desc: "精致衣服（轻柔）"
        },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "00-12" 参数2离线码"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "00,09",
      title: "美的6.5公斤波轮洗衣机：MB65-GF03W",
      pname: "00洗衣机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "03,06",
          name: "特殊功能设置",
          desc: "06表示：预约功能，1表示：开启（0表示关闭）",
          params: true,
          params1: true
        },
        {
          cmdCode: "03,07",
          name: "过程参数设置",
          desc:
            '过程参数设置格式："标准洗时间,大件洗时间,加温洗时间,快洗时间,洗衣液泵时间,加热温度,是否允许筒清洁功能,是否允许洗衣液功能,是否允许断电记忆功能" 如"20,20,20,20,10,50,1,1,1"',
          params: true
        },
        {
          cmdCode: "04,03",
          name: "重启或提前结束订单",
          desc: "重启或提前结束订单"
        },
        { cmdCode: "05,FF", name: "激活洗衣机", desc: "激活洗衣机" },
        { cmdCode: "05,00", name: "启动筒自洁", desc: "启动筒自洁" },
        { cmdCode: "05,01", name: "单脱水10分钟", desc: "单脱水10分钟" },
        { cmdCode: "05,02", name: "小件洗25分钟", desc: "小件洗25分钟" },
        { cmdCode: "05,03", name: "普通洗35分钟", desc: "普通洗35分钟" },
        { cmdCode: "05,04", name: "超强洗45分钟", desc: "超强洗45分钟" },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "FF-04" 参数2表示离线码，"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "00,11",
      title: "东皖福尼亚洗衣机：DWFNY-XXX",
      pname: "00洗衣机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "01,00",
          name: "查询设备状态",
          desc: "查询设备状态",
          callback: true
        },
        { cmdCode: "02,00", name: "查询总金额", desc: "查询总金额" },
        {
          cmdCode: "03,01",
          name: "设置功能水位",
          desc:
            '设置功能水位，参数说明 参数1表示设置类型 "02"-快速洗 "03"-标准洗 "04"-大物洗 "05"-浸泡洗，参数2表示设置水位值(1~12)',
          params: true,
          params1: true
        },
        {
          cmdCode: "03,02",
          name: "设置功能时间",
          desc:
            '设置功能时间，参数说明 参数1表示设置类型 "01"-单脱 "02"-快速洗 "03"-标准洗 "04"-大物洗，参数2表示设置时间值(0～153)，PS：没有浸泡？',
          params: true,
          params1: true
        },
        {
          cmdCode: "03,05",
          name: "设置功能脉冲价格",
          desc:
            '设置功能脉冲价格，参数说明 参数1表示设置类型 "01"-单脱 "02"-快速洗 "03"-标准洗 "04"-大物洗 "05"-浸泡洗，参数2表示设置价格，就是脉冲数(0～153)',
          params: true,
          params1: true
        },
        {
          cmdCode: "03,06",
          name: "特殊功能",
          desc:
            '特殊功能，参数说明 参数1表示功能类型 "09"-恢复出厂设置 "0A"-断电排水 "04"-断电记忆 "0B"-倒计时 参数2: 1 开启 2 关闭',
          params: true,
          params1: true
        },
        { cmdCode: "05,01", name: "启动单脱", desc: "启动单脱" },
        { cmdCode: "05,02", name: "启动快速洗", desc: "启动快速洗" },
        { cmdCode: "05,03", name: "启动标准洗", desc: "启动标准洗" },
        { cmdCode: "05,04", name: "启动大物洗", desc: "启动大物洗" },
        { cmdCode: "05,05", name: "启动浸泡洗", desc: "启动浸泡洗" },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "01"-单脱 "02"-快速洗 "03"-标准洗 "04"-大物洗 "05"-浸泡洗，参数2表示离线码，"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "00,12",
      title: "凤凰洗衣机：FENGHUANG-XXX",
      pname: "00洗衣机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "01,00",
          name: "查询设备状态",
          desc: "查询设备状态",
          callback: true
        },
        {
          cmdCode: "03,05",
          name: "设置功能脉冲价格",
          desc:
            '{ "1,2,3,4,10" }表示："洗衣程序1的投币值，洗衣程序2的投币值,洗衣程序3的投币值,洗衣程序4的投币值(0~99),洗衣液释放时间(0~120)"',
          params: true
        },
        {
          cmdCode: "03,06",
          name: "特殊功能",
          desc: "07：表示故障清除 08：表示状态清除（复位） ",
          params: true
        },
        {
          cmdCode: "05,01",
          name: "启动程序1（单脱）",
          desc: "启动程序1（单脱）"
        },
        {
          cmdCode: "05,02",
          name: "启动程序2（快洗）",
          desc: "启动程序2（快洗）"
        },
        {
          cmdCode: "05,03",
          name: "启动程序3（标准洗）",
          desc: "启动程序3（标准洗）"
        },
        {
          cmdCode: "05,04",
          name: "启动程序4（大物洗）",
          desc: "启动程序4（大物洗）"
        },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "01"-启动程序1 "02"-启动程序2 "03"-启动程序3 "04"-启动程序4 "58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "00,14",
      title: "TCL微信自主洗衣机（TCL_2G）：XQB50-BD-PC",
      pname: "00洗衣机",
      cmdList: [
        { cmdCode: "00,00", name: "请求命令", desc: "请求命令" },
        { cmdCode: "01,00", name: "查询设备状态", desc: "查询设备状态" },
        { cmdCode: "02,00", name: "查询总金额", desc: "查询总金额" },
        {
          cmdCode: "03,00",
          name: "数字显示命令",
          desc:
            '"--,1" 显示--，蜂鸣器响1声 "==,1" 显示==，蜂鸣器响1声 "  ,3" 不显示，蜂鸣器响3声 "AB,3" 显示ab，蜂鸣器响3声 "88,3" 显示88，蜂鸣器响3声',
          params: true
        },
        {
          cmdCode: "03,09",
          name: "设置工作模式",
          desc: '"0"：设置为工厂模式 1：设置为用户模式 ',
          params: true
        },
        { cmdCode: "04,03", name: "复位", desc: "复位" },
        {
          cmdCode: "05,01",
          name: "单脱",
          desc: "单脱 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,02",
          name: "快洗",
          desc: "快洗 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,03",
          name: "标准",
          desc: "标准 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,04",
          name: "大物",
          desc: "大物 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,05",
          name: "筒自洁",
          desc: "筒自洁 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,06",
          name: "能效半载",
          desc: "能效半载 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,07",
          name: "能效全载",
          desc: "能效全载 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,08",
          name: "工厂模式C1",
          desc: "工厂模式C1 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,09",
          name: "工厂模式C2",
          desc: "工厂模式C2 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,0A",
          name: "工厂模式C3",
          desc: "工厂模式C3 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,0B",
          name: "工厂模式C4",
          desc: "工厂模式C2 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,0C",
          name: "洗衣机解锁",
          desc: "洗衣机解锁 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,0D",
          name: "脱水程序（耐久）",
          desc: "脱水程序（耐久） 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,0E",
          name: "快速程序（耐久）",
          desc: "快速程序（耐久） 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,0F",
          name: "标准程序（耐久）",
          desc: "标准程序（耐久） 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,10",
          name: "大物程序（耐久）",
          desc: "大物程序（耐久） 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,11",
          name: "电脑板自检",
          desc: "电脑板自检 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,12",
          name: "筒自洁+脱水",
          desc: "筒自洁+脱水 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,13",
          name: "筒自洁+快洗",
          desc: "筒自洁+快洗 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,14",
          name: "筒自洁+标准",
          desc: "筒自洁+标准 1: 启动 0 结束",
          params: true
        },
        {
          cmdCode: "05,15",
          name: "筒自洁+大物",
          desc: "筒自洁+大物 1: 启动 0 结束",
          params: true
        }
      ]
    },
    {
      code: "00,15",
      title: "傻老板洗衣机：SLB88-888",
      pname: "00洗衣机",
      cmdList: [
        { cmdCode: "05,01", name: "启动单脱6min", desc: "启动单脱6min" },
        { cmdCode: "05,02", name: "启动快速洗23min", desc: "启动快速洗23min" },
        { cmdCode: "05,03", name: "启动标准洗38min", desc: "启动标准洗38min" },
        { cmdCode: "05,04", name: "启动加强洗45min", desc: "启动加强洗45min" },
        {
          cmdCode: "05,05",
          name: "启动标准浸泡46min",
          desc: "启动标准浸泡46min"
        },
        {
          cmdCode: "05,06",
          name: "启动加强浸泡53min",
          desc: "启动加强浸泡53min"
        },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "01"-单脱6min "02"-快速洗23min "03"-标准洗38min "04"-加强洗45min "05"-标准浸泡46min "06"-加强浸泡53min "58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "00,16",
      title: "傻老板洗衣机：HX-XYJ02",
      pname: "00洗衣机",
      cmdList: [
        { cmdCode: "05,01", name: "启动单脱6min", desc: "启动单脱6min" },
        { cmdCode: "05,02", name: "启动快速洗23min", desc: "启动快速洗23min" },
        { cmdCode: "05,03", name: "启动标准洗38min", desc: "启动标准洗38min" },
        { cmdCode: "05,04", name: "启动加强洗45min", desc: "启动加强洗45min" },
        {
          cmdCode: "05,05",
          name: "启动标准浸泡46min",
          desc: "启动标准浸泡46min"
        },
        {
          cmdCode: "05,06",
          name: "启动加强浸泡53min",
          desc: "启动加强浸泡53min"
        },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "01"-单脱6min "02"-快速洗23min "03"-标准洗38min "04"-加强洗45min "05"-标准浸泡46min "06"-加强浸泡53min "58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "00,0C",
      title: "有方洗衣机：NEOWAY-XXX（企鹅洗衣机，北京董总定制）",
      pname: "00洗衣机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "01,00",
          name: "查询设备状态",
          desc: "查询设备状态",
          callback: true
        },
        {
          cmdCode: "03,06",
          name: "特殊功能",
          desc:
            '特殊功能参数格式："掉电记忆功能,全程半程保护功能,加热功能,桶清洁功能,按键使能,投币使能 1开启 0 关闭" 如"1,1,1,1,1,1"',
          params: true
        },
        {
          cmdCode: "03,02",
          name: "时间设置",
          desc:
            '时间参数格式："单脱时间[0..255],快速时间,标准时间,大物时间,液泵时间,加热快速时间,加热标准时间,加热大物时间" 如"10,20,40,60,10,10,10,10"',
          params: true
        },
        {
          cmdCode: "03,05",
          name: "价格设置",
          desc:
            '价格设置格式："单脱价格[0..255],快速价格,标准价格,大物价格,加热快速价格,加热标准价格,加热大物价格(注意：这个参数是错误的，罗改过后 单脱价格,X,X,X,快速价格,标准价格,大物价格)" 如"5,6,7,8,20,20,20"',
          params: true
        },
        {
          cmdCode: "03,07",
          name: "过程参数设置",
          desc:
            '过程参数设置格式："快速水位[0..255],标准水位,大物水位,脱水转速,温度" 如"1,2,3,20,20"',
          params: true
        },
        { cmdCode: "04,01", name: "暂停", desc: "暂停" },
        { cmdCode: "04,02", name: "暂停恢复启动", desc: "暂停恢复启动" },
        { cmdCode: "04,04", name: "结束", desc: "结束" },
        { cmdCode: "05,00", name: "启动筒自洁", desc: "启动筒自洁" },
        { cmdCode: "05,01", name: "启动单脱水", desc: "启动单脱水" },
        { cmdCode: "05,02", name: "启动快速洗", desc: "启动快速洗" },
        { cmdCode: "05,03", name: "启动标准洗", desc: "启动标准洗" },
        { cmdCode: "05,04", name: "启动大物洗", desc: "启动大物洗" },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "00"-筒自洁 01"-单脱 "02"-快速洗 "03"-标准洗 "04"-大物洗，参数2表示离线码，"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "00,0A",
      title: "美的滚筒洗衣机：MG80-GF03DW",
      pname: "00洗衣机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "03,06",
          name: "特殊功能设置",
          desc: "06表示：预约功能，1表示：开启（0表示关闭）",
          params: true,
          params1: true
        },
        {
          cmdCode: "04,03",
          name: "重启或提前结束订单",
          desc: "重启或提前结束订单"
        },
        { cmdCode: "05,FF", name: "激活洗衣机", desc: "激活洗衣机" },
        { cmdCode: "05,00", name: "启动筒自洁", desc: "启动筒自洁" },
        { cmdCode: "05,01", name: "单脱水12分钟", desc: "单脱水12分钟" },
        { cmdCode: "05,02", name: "小件洗30分钟", desc: "小件洗30分钟" },
        { cmdCode: "05,03", name: "普通洗35分钟", desc: "普通洗35分钟" },
        { cmdCode: "05,04", name: "超强洗55分钟", desc: "超强洗55分钟" },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "FF-04" 参数2表示离线码，"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "00,0B",
      title: "LG巨人Pro洗衣机：FH069FD2F",
      pname: "00洗衣机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        { cmdCode: "04,03", name: "重启", desc: "重启" },
        { cmdCode: "04,05", name: "开机", desc: "开机" },
        { cmdCode: "05,00", name: "筒自洁", desc: "启动筒自洁" },
        { cmdCode: "05,01", name: "白色特脏", desc: "白色特脏" },
        {
          cmdCode: "05,02",
          name: "白色特脏+增加洗涤时间",
          desc: "白色特脏+增加洗涤时间"
        },
        { cmdCode: "05,03", name: "普通混合", desc: "普通混合" },
        {
          cmdCode: "05,04",
          name: "普通混合+增加洗涤时间",
          desc: "普通混合+增加洗涤时间"
        },
        { cmdCode: "05,05", name: "精致衣服", desc: "精致衣服" },
        {
          cmdCode: "05,06",
          name: "精致衣服+增加洗涤时间",
          desc: "精致衣服+增加洗涤时间"
        },
        { cmdCode: "05,07", name: "混纺尼龙", desc: "混纺尼龙" },
        {
          cmdCode: "05,08",
          name: "混纺尼龙+增加洗涤时间",
          desc: "混纺尼龙+增加洗涤时间"
        },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "00"-筒自洁 "01"-白色特脏+不增加洗涤时间 "02"-启动程序2 "03"-启动程序3 "04"-启动程序4 "05"- "06"- "07"- "08"- "58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "00,0E",
      title: "海狸洗衣机：HAILI-XXX",
      pname: "00洗衣机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "01,00",
          name: "查询设备状态",
          desc: "查询设备状态",
          callback: true
        },
        {
          cmdCode: "01,01",
          name: "查询报警状态",
          desc: "查询报警状态",
          callback: true
        },
        {
          cmdCode: "03,00",
          name: "数字显示",
          desc:
            '数字显示, 参数1: 显示8996数字 如"8, 9, 9, 6" (int[4] {8,9,9,6}) ',
          params: true
        },
        { cmdCode: "05,01", name: "启动单脱", desc: "启动单脱" },
        { cmdCode: "05,02", name: "启动快速洗", desc: "启动快速洗" },
        { cmdCode: "05,03", name: "启动标准洗", desc: "启动标准洗" },
        { cmdCode: "05,04", name: "启动大物洗", desc: "启动大物洗" },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "01-04" 参数2离线码"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "01,01",
      title: "美的全自动洗鞋机：MB65-GFX05W",
      pname: "01洗鞋机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "03,06",
          name: "特殊功能设置",
          desc: "06表示：预约功能，1表示：开启（0表示关闭）",
          params: true,
          params1: true
        },
        {
          cmdCode: "04,03",
          name: "重启或提前结束订单",
          desc: "重启或提前结束订单"
        },
        { cmdCode: "05,FF", name: "激活洗衣机", desc: "激活洗衣机" },
        { cmdCode: "05,00", name: "启动筒自洁", desc: "启动筒自洁" },
        { cmdCode: "05,01", name: "单脱水10分钟", desc: "单脱水10分钟" },
        { cmdCode: "05,02", name: "小件洗25分钟", desc: "小件洗25分钟" },
        { cmdCode: "05,03", name: "普通洗35分钟", desc: "普通洗35分钟" },
        { cmdCode: "05,04", name: "超强洗45分钟", desc: "超强洗45分钟" },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "FF-04" 参数2表示离线码，"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "02,00",
      title: "海尔6kg滚筒干衣机：SGDZ6-1U1",
      pname: "02烘干机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "01,00",
          name: "查询设备状态",
          desc: "查询设备状态",
          callback: true
        },
        {
          cmdCode: "01,01",
          name: "查询报警状态",
          desc: "查询报警状态",
          callback: true
        },
        {
          cmdCode: "03,00",
          name: "数字显示",
          desc:
            '数字显示, 参数1: 显示8996数字 如"8, 9, 9, 6" (int[4] {8,9,9,6}) ',
          params: true
        },
        {
          cmdCode: "05,00",
          name: "低温XX分钟",
          desc: '启动低温XX分钟, 参数1 启动时间 "10"',
          params: true
        },
        {
          cmdCode: "05,01",
          name: "高温XX分钟",
          desc: '启动高温XX分钟, 参数1 启动时间 "10"',
          params: true
        },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "00-01" 参数2离线码"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "02,01",
      title: "海尔8kg滚筒干衣机(白色款)：SGDN8-636U7",
      pname: "02烘干机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "01,00",
          name: "查询设备状态",
          desc: "查询设备状态",
          callback: true
        },
        {
          cmdCode: "01,01",
          name: "查询报警状态",
          desc: "查询报警状态",
          callback: true
        },
        {
          cmdCode: "03,00",
          name: "数字显示",
          desc:
            '数字显示, 参数1: 显示8996数字 如"8, 9, 9, 6" (int[4] {8,9,9,6}) ',
          params: true
        },
        {
          cmdCode: "03,02",
          name: "时间设置",
          desc:
            '时间设置, { "05", 10}，05表示：“1元购买时间”，10表示：“10分钟”',
          params: true,
          params1: true
        },
        {
          cmdCode: "03,06",
          name: "特殊功能设置",
          desc:
            '特殊功能设置, { "01", 1 }，01表示：刷卡投币功能，1表示：开启（0表示关闭） 06表示：APP预约功能，1表示：开启（0表示关闭）',
          params: true,
          params1: true
        },
        { cmdCode: "04,01", name: "暂停", desc: "暂停" },
        { cmdCode: "04,02", name: "暂停启动", desc: "暂停启动" },
        { cmdCode: "04,03", name: "复位", desc: "复位" },
        {
          cmdCode: "05,00",
          name: "低温XX分钟",
          desc: '启动低温XX分钟, 参数1 启动时间 "10"',
          params: true
        },
        {
          cmdCode: "05,01",
          name: "高温XX分钟",
          desc: '启动高温XX分钟, 参数1 启动时间 "10"',
          params: true
        },
        {
          cmdCode: "05,02",
          name: "中温XX分钟",
          desc: '启动中温XX分钟, 参数1 启动时间 "10"',
          params: true
        },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "00-02" 参数2离线码"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "02,02",
      title: "海尔13kg滚筒干衣机(白色款)：SGDZ13-09810YU1",
      pname: "02烘干机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "01,00",
          name: "查询设备状态",
          desc: "查询设备状态",
          callback: true
        },
        {
          cmdCode: "01,01",
          name: "查询报警状态",
          desc: "查询报警状态",
          callback: true
        },
        {
          cmdCode: "03,00",
          name: "数字显示",
          desc:
            '数字显示, 参数1: 显示8996数字 如"8, 9, 9, 6" (int[4] {8,9,9,6}) ',
          params: true
        },
        {
          cmdCode: "05,00",
          name: "低温XX分钟",
          desc: '启动低温XX分钟, 参数1 启动时间 "10" "20" "30"',
          params: true
        },
        {
          cmdCode: "05,01",
          name: "高温XX分钟",
          desc: '启动高温XX分钟, 参数1 启动时间 "10" "20" "30',
          params: true
        },
        {
          cmdCode: "05,02",
          name: "中温XX分钟",
          desc: '启动中温XX分钟, 参数1 启动时间 "10" "20" "30',
          params: true
        },
        {
          cmdCode: "05,03",
          name: "冷风XX分钟",
          desc: '启动冷风XX分钟, 参数1 启动时间 "10" "20" "30',
          params: true
        },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "00-03" 参数2离线码"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "02,03",
      title: "美的滚筒干衣机：MH80-GFL03W",
      pname: "02烘干机",
      cmdList: [
        {
          cmdCode: "00,00",
          name: "请求命令",
          desc: "请求命令",
          callback: true
        },
        {
          cmdCode: "03,06",
          name: "特殊功能设置",
          desc: "06表示：预约功能，1表示：开启（0表示关闭）",
          params: true,
          params1: true
        },
        {
          cmdCode: "04,03",
          name: "重启或提前结束订单",
          desc: "重启或提前结束订单"
        },
        {
          cmdCode: "05,FF",
          name: "激活干衣机",
          desc: "激活干衣机 参数1: 00",
          params: true
        },
        {
          cmdCode: "05,00",
          name: "普通烘10分钟",
          desc: "普通烘XX分钟, 参数1: 烘干时间，如10",
          params: true
        },
        {
          cmdCode: "05,01",
          name: "超强烘10分钟",
          desc: "超强烘XX分钟, 参数1: 烘干时间，如10",
          params: true
        },
        {
          cmdCode: "06,00",
          name: "离线码设置",
          desc:
            '离线码设置，参数说明 参数1表示设置类型 "FF-02" 参数2表示离线码，"58073641,94406340,74776103,24379864,88060135"',
          params: true,
          params1: true
        }
      ]
    },
    {
      code: "03,00",
      title: "富磊吹风机：QIECF-CJYF-001",
      pname: "05吹风机",
      cmdList: [
        {
          cmdCode: "05,00",
          name: "启动吹风机",
          desc:
            '启动吹风机 参数说明："1, 300" 1：表示一号吹风机（支持1或2），300：表示300秒（0表示复位，取值范围0~65535）',
          params: true
        },
        {
          cmdCode: "05,01",
          name: "参数配置",
          desc:
            '价格时间设置："0,5,0,10,0,0,0,0,0,0,1" 1元对应运行时间, 2元对应运行时间, 3元对应运行时间, 4元对应运行时间, 5元对应运行时间, 6元对应运行时间, 7元对应运行时间, 8元对应运行时间, 9元对应运行时间, 10元对应运行时间（取值范围0~16，单位分钟）, 记忆功能（1表示开启，0表示关闭）',
          params: true
        },
        {
          cmdCode: "05,02",
          name: "运行时间查询",
          desc: "运行时间查询",
          callback: true
        },
        { cmdCode: "05,03", name: "参数查询", desc: "参数查询", callback: true }
      ]
    }
  ]
};

// 企鹅
const QiekjCodeModel = {
  topicList: [],
  modelList: []
};

// 合宙
const HezhouCodeModel = {
  topicList: [],
  modelList: []
};

// 其他
const OtherCodeModel = {
  topicList: [],
  modelList: []
};

export default {
  name: "page-device-cmd",
  data () {
    return {
      productKey: "OknnjzXxXX2",
      imei: "865933033",
      topic: "cmd",
      company: "youfang",
      codeModel: YoufangCodeModel,
      productKeyList: [
        { key: "OknnjzXxXX2", name: "有方2G", company: "youfang" },
        { key: "0UATIFOGgqQ", name: "有方4G", company: "youfang" },
        { key: "a1ZzwX4iqlq", name: "企鹅2G", company: "qiekj" },
        { key: "a12PdjKiDOW", name: "企鹅4G", company: "qiekj" },
        { key: "eOPxnu2RFCt", name: "合宙", company: "hezhou" },
        { key: "81IhJTolfnz", name: "其他", company: "other" }
      ],

      // 串口指令相关
      machine: null,
      command: null,
      params: null,
      params1: null,
      params2: null,

      // 脉冲指令相关
      impulseNum: 1,
      impulseWidth: 6,
      impulseSpace: 100,

      // 接口返回值
      resp: null
    };
  },
  created () {
    // this.productKey = this.productKeyList
  },
  methods: {
    handleSubmit () {
      if (!this.productKey || !this.imei || !this.topic) {
        alert("请求参数错误");
        return;
      }

      let data = {
        productKey: this.productKey,
        IMEI: this.imei,
        topic: this.topic
      };

      switch (this.topic) {
        // 有方串口
        case "cmd":
          if (!this.machine || !this.command) {
            alert("发送串口指令参数不足");
            return;
          }
          data.machineCode = this.machine.code;
          data.cmdCode = this.command.cmdCode;
          if (this.params) {
            data.params = this.params;
          }

          if (this.params1) {
            data.params1 = this.params1;
          }

          if (this.params2) {
            data.params2 = this.params2;
          }

          if (this.command.callback) {
            data.callback = true;
          }
          break;
        // 有方脉冲
        case "control":
          if (this.impulseNum <= 0) {
            alert("脉冲数量错误！");
            return;
          }
          data.impulseNum = this.impulseNum;
          break;
        // 有方调整脉冲间隔
        case "setsignal":
          if (this.impulseWidth <= 0 || this.impulseSpace <= 0) {
            alert("脉冲调整参数错误");
            return;
          }
          data.impulseWidth = this.impulseWidth;
          data.impulseSpace = this.impulseSpace;
          break;
      }
      this.$axios.post(Api.MACHINE_IOT, data).then(resp => {
        this.resp = resp;
        // console.log(resp)
      });
    }
  },
  computed: {},
  watch: {
    productKey (key) {
      let product = this.productKeyList.find(item => item.key === key);
      this.company = product.company;
      switch (this.company) {
        case "youfang":
          this.codeModel = YoufangCodeModel;
          break;
        case "qiekj":
          this.codeModel = QiekjCodeModel;
          break;
        case "hezhou":
          this.codeModel = HezhouCodeModel;
          break;
        default:
          this.codeModel = OtherCodeModel;
      }
    }
  },
  components: {
    QBreadcrumb
  }
};
</script>

<style lang="less" scoped>
.m10 {
  margin: 10px;
}
.f12 {
  font-size: 12px;
  line-height: 16px;
}
</style>
