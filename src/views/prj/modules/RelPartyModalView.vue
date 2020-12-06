<template>
  <div>
    <project-person v-if="isLoad" ref="ProjectPerson" :projectCode="prjCode" :mapId="mapId"></project-person>
  </div>
</template>

<script>
  import { getAction, postAction } from '../../../api/manage'
  import ProjectPerson from './ProjectPerson'

  export default {
    name: 'RelPartyModalView',
    components: { ProjectPerson },
    props:{
      businessKey:''
    },
    data() {
      return {
        prjCode:'',
        mapId:'',
        isLoad:false
      }
    },
    created() {
      this.initPage();
    },
    methods: {
      initPage(){
        let that = this;
        if(this.businessKey){
          let bizKey=this.businessKey.split(':')[1];
          let keyArr=bizKey.split('|');          
          if(keyArr.length>1){
            this.prjCode=bizKey.split('|')[1];
            this.isLoad=true;
          }else{
            this.mapId=keyArr[0];
            getAction("/prj/rel/findPrjCodeById", {id:keyArr[0]}).then((res) => {
              if (res.success) {
                that.prjCode=res.result.prjCode;
                that.isLoad=true;
              }
            })
          }
        }
      }
    }
  }
</script>