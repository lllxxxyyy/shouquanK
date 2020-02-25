<!--  -->
<template>
  <div class="home">
      <div class="home_header">
          <div class="home_loge"><img :src="imgSrc+'loge.png'" alt=""></div>
          <div class="city_name"><span>所在城市（或地区）·{{cityName}}</span><img @click="Area" :src="imgSrc+'jiantou.png'" alt=""></div>
          <div class="Home_search">
              <img @click="search" :src="imgSrc+'search.png'"  alt="">
              <input type="text" v-model="comName"  placeholder="请输入公司名称">
          </div>
      </div>
      <div class="home_Con">
            <div class="authorize_title">
                <span>授权信息</span>
            </div>
            <div class="authorize_desWrapper">
                <div class="authorize_des">
                <div class="authorize_desName">
                    <span class="Authorization_date">授权日期</span>
                    <span class="company_name">公司名称</span>
                    <span class="business_license">营业执照</span>
                    <span class="Contact_person">联系人</span>
                    <span class="Contact_phone">联系电话</span>
                    <span class="look_over">查看</span>
                </div>
                <ul class="authorize_desList">
                    <li v-for="(value,index) in AListData" :key="index">
                        <span class="Authorization_date">{{value.add_time}}</span>
                        <span class="company_name">{{value.user_name}}</span>
                        <span class="business_license"> <img :src="value.img" alt=""> </span>
                        <span class="Contact_person">{{value.nickname}}</span>
                        <span class="Contact_phone">{{value.tel}}</span>
                        <span class="look_over" @click="toDetail(value.id)">查看详情</span>
                    </li>
                </ul>
            </div>
            </div>
          
      </div>

      <div class="whereArea" v-if="showWhere" @click="hideWhere">
          <div class="whereAreaBox" @click.stop>
               <div class="whereAreaTitle">
                   <div class="whereAreaBtn" @click="whereAreaBtn">取消</div>
                    <span>选择所在城市</span>
                    <div class="whereAreaBtn" @click="sureCity" >确定</div>
                </div>
                
                <div class="swiperWrapper">
                    <div class="swiperWrapp provinceWrapper">
                        <span class="provinceTitle">{{provinceTitle}}</span>
                        <swiper class="swiperList province"  :options="swiperOption" >
                            <swiper-slide class="provinceList"  v-for="(item,index) in provinceList" :key="index">
                                <span @click="provinceBox(item.id,item.name)">{{item.name}}</span>
                            </swiper-slide>
                        </swiper>
                    </div>
                    <div class='swiperWrapp cityWrapper'>
                        <span class="cityTitle">{{cityTitle}}</span>
                        <swiper class="swiperList city" :options="swiperOption" >
                            <swiper-slide class="cityList"  v-for="(item,index) in cityList" :key="index">
                                <span @click="cityBox(item.id,item.name)">{{item.name}}</span>
                            </swiper-slide>
                        </swiper>
                    </div>
                </div>
          </div>
        </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import qs from 'qs'
import {mapMutations} from 'vuex'
export default {
  data () {
    return {
        idText:0,
        showWhere:false,
        provinceTitle:'省',
        cityTitle:'市',
        provinceList:"",
        provinceList:[],
        cityList:[],
         swiperOption: {
            direction: 'vertical',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbar: {
                el: '.province'
          },
        },
         swiperOption: {
             direction: 'vertical',
            slidesPerView: 'auto',
            freeMode: true,
            scrollbar: {
                el: '.city'
          },
        },

        AListData:'',//授权列表

        cityName:'北京',
        comName:'',

        
    };
  },

  components: {},

   computed:{
        ...mapState(['imgSrc','detailId'])
    },

  mounted(){
      this.$http.post('/shouquan/empower/index').then((res)=>{
          this.AListData=res.data.data
      })
  },

  methods: {
      search(){
          var obj=qs.stringify({
              user_name:this.comName,
              province:'',
              city:'',
          })
          this.$http.post('/shouquan/empower/index',obj).then((res)=>{
            this.AListData=res.data.data
        })
      },
      sureCity(){
         
          for(var i=0;i<this.cityTitle.length;i++){
              if(this.cityTitle[i]=="市"){
                 this.cityName=this.cityTitle.slice(0,i)
                 console.log(i)
              }
          }
           var obj=qs.stringify({
              user_name:'',
              province:this.provinceTitle,
              city:this.cityName,
          })
          this.$http.post('/shouquan/empower/index',obj).then((res)=>{
            this.AListData=res.data.data
            this.showWhere=false
        })
      },
       //   获取省份列表数据
      Area(){
          this.showWhere=true
          var obj=qs.stringify({
              id:0,
          })
          this.$http.post("/shouquan/empower/region",obj).then((res)=>{
            if(res.data.code==200){
                var data=res.data.data
                this.provinceList=data
            }else{
                var self=this
                clearInterval(self.timer2);
                this.promptContent=res.data.msg
                this.showPrompt=true
                self.timer2=setTimeout(function(){
                    self.showPrompt=false
                    clearInterval(self.timer2);
                },2000)
                return false;
            }   
          })
      },
      toDetail(id){
          this.detailIds(id)
          this.$router.push('/ADetails')
      },
      //点击灰色区域   选择地址盒子消失
      hideWhere(){
          this.showWhere=false
      },
      // 点击取消  选择地址盒子消失
      whereAreaBtn(){
          this.showWhere=false
      },
      //   点击省份列表
      provinceBox(provinceId,provinceName){
          this.provinceTitle=provinceName;
          this.provinceId=provinceId;
          this.countyList=[];
        //   获取城市列表
           var obj=qs.stringify({
              id:provinceId,
          })
          this.$http.post('/shouquan/empower/region',obj).then((res)=>{
            if(res.data.code==200){
                var data=res.data.data
                this.cityList=data
            }else{
                var self=this
                clearInterval(self.timer2);
                this.promptContent=res.data.msg
                this.showPrompt=true
                self.timer2=setTimeout(function(){
                    self.showPrompt=false
                    clearInterval(self.timer2);
                },2000)
                return false;
            }
          })
      },
        // 点击城市列表
      cityBox(cityId,cityName){
          this.cityTitle=cityName
      },
      ...mapMutations(['detailIds']),
  }
}

</script>
<style scoped lang="stylus">
.home{
    width:100%;
    height:100%;
    background :rgba(246, 246, 252, 1);
}
 .home_header{
     width:100%;
     height:5.56rem;
     background :url('/static/mock/img/bg.png') no-repeat;
     background-size:100%;
     display :flex;
     flex-direction :column;
     align-items :center;
     position :relative;
 }
 .home_loge{
     padding-top:1.51rem;
     margin-bottom:0.253rem;
     text-align :center;
     img{
         width:0.76rem;
        height:0.733rem;
     }
 }
 .city_name{
     font-size:0.48rem;
     color:rgba(0, 0, 0, 1);
     letter-spacing :0.02rem;
     >img{
         width:0.4rem;
         height:0.24rem;
         margin-left:0.2rem;
     }
 }
 .Home_search{
     width:9.2rem;
     height:1.33rem;
     background :#fff;
     display :flex;
     align-items :center;
     border-radius:0.08rem;
     padding:0 0.27rem;
     position :absolute;
     left:50%;
     margin-left:-4.6rem;
     bottom:0;
     >img{
         width:0.47rem;
         height:0.48rem;
         margin-right:0.27rem;
     }
     >input{
         font-size:0.427rem;
         color:rgba(0, 0, 0, 0.38);
         border:0;
         outline :none;
     }
 }

 .home_Con{
      width:9.2rem;
     background :#fff;
     padding:0.27rem;
     padding-right:0;
     margin:0 0.4rem;
     margin-top:0.67rem;
     
     
     >.authorize_title{
         padding-left:0.27rem;
         >span{
             font-size:0.43rem;
             font-weight:bold;
             color:rgba(0, 0, 0, 0.9);
             position :relative;
             &:before{
                 content:"";
                 width:0.08rem;
                 height:0.53rem;
                 background :rgba(63, 121, 254, 1);
                 border-radius:0.5rem;
                 position :absolute;
                 top:50%;
                 margin-top:-0.27rem;
                 left:-0.27rem;
             }
         }
     }
 }
  .authorize_desWrapper{
    width:8.93rem; 
    overflow :hidden;
    overflow-x:scroll;
 }
 .authorize_des{
     width:13.21rem;
     margin-top:0.27rem;
     border-top:0.03rem solid rgba(0, 0, 0, 0.14) ;
     border-left:0.03rem solid rgba(0, 0, 0, 0.14) ;
     .authorize_desName{
         font-size:0.373rem;
         background :rgba(246, 246, 252, 1);
         display :flex;
         >span{
             height:1.173rem;
             text-align :center;
             line-height :1.173rem;
             border-right:0.03rem solid rgba(0, 0, 0, 0.14) ;
             border-bottom:0.03rem solid rgba(0, 0, 0, 0.14) ;
         }
         
     }
     >.authorize_desList{
            >li{
                    font-size:0.32rem;
                    color:rgba(0, 0, 0, 1);
                    display :flex;
                >span{
                    height:1.173rem;
                    text-align :center;
                    line-height :1.173rem;
                    border-right:0.03rem solid rgba(0, 0, 0, 0.14) ;
                    border-bottom:0.03rem solid rgba(0, 0, 0, 0.14) ;
                    >img{
                        width:1.49rem;
                        height:0.973rem;
                    }
                }
            }
        }
 }
 
        .Authorization_date{
             width:2.03rem;
         }
         .company_name{
             width:4.17rem;
         }
         .business_license{
             width:1.8rem;
         }
         .Contact_person{
             width:1.27rem;
         }
         .Contact_phone{
             width:2.33rem;
         }
         .look_over{
             width:1.59rem;
         
         }
         .whereArea{
    width:100%;
    height:100%;
    position :absolute;
    top:0;
    left:0;
    background :rgba(0,0,0,0.5)
    
}
.whereAreaBox{
    width:100%;
    height:13.33rem;
    position :absolute;
    bottom:0;
    left:0;
    background :#fff;
    >.swiperWrapper{
        display:flex;
        justify-content :space-between;
        >.swiperWrapp{
            width:50%;
            height:13.33rem;
            overflow :hidden;
            >.swiperList{
                width:100%;
                height:13.33rem;
                overflow :hidden;
            }
        }
    }
    >.whereAreaTitle{
        font-size:0.4rem;
        width:100%;
        height:0.8rem;
        text-align :center;
        line-height :0.8rem;
        display:flex;
        justify-content :space-between;
        align-items :center;
        padding:0 0.4rem;
    }
    >.whereAreaBtn{
        font-size:0.37rem;
        width:100%;
        // height:0.3rem;
        text-align :right;
        // line-height :0.5rem;
        padding:0 0.27rem;
    }
}
.provinceList,.cityList,.countyList{
    width:100%;
    font-size:0.32rem;
    height:0.8rem;
    line-height :0.8rem;
    text-align :center;
}
.provinceTitle,.cityTitle,.countyTitle{
    width:100%;
    height:0.8rem;
    display:inline-block;
    text-align:center;
    font-size:0.37rem;
    line-height :0.8rem;
    border-bottom:0.03rem solid #F1F1F1;
}
.province{
    background :rgba(246, 246, 252, 1);
}
</style>