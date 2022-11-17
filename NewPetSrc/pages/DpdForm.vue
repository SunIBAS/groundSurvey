<template>
	<el-form label-width="120px" label-position="top" class="my-form">
		<el-form-item v-for="formItem in formItems" :label="formItem.label" :key="formItem.name">
			<el-select style="width: 100%;" v-model="formItem.value"
					   @change="updateChange" :disabled="!edit"
					   clearable :placeholder='$lang.get("请选择")'>
				<el-option
					v-for="item in formItem.options"
					:key="item.id"
					:label="item.label"
					:value="item.id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item :label="$lang.get('图片')">
			<UploadImage v-show="edit" @handleAvatarSuccess="handleAvatarSuccess" :offline="offline"></UploadImage>
			<div class="dpp-images" style="padding-top: 5px;">
				<div v-for="(url,ind) in images.urls" class="image-block" :id="`urls_${url.id}`"
                     :key="ind" @click="e => doOperate(e,ind,'urls',url.id)">
                    <img :src="url.imgUrl" alt="">

                    <div :style="{display: url.operation ? 'table' : 'none'}" class="operation-marker">
                        <div class="close">关闭/Close</div>
                        <div class="operation">
                            <div class="btn delete">删除/Delete</div>
                        </div>
                    </div>
                </div>
			</div>
			<div class="dpp-images">
                <div v-for="(src,ind) in images.sources" class="image-block" :id="`sources_${src.id}`"
                     :key="ind" @click="e => doOperate(e,ind,'sources',src.id)">
                    <MyImage :src="src.imgUrl" :base64="src.base64"
                             @updateImageBase64="base64 => updateImageBase64(base64,ind,'sources')"></MyImage>

                    <div :style="{display: src.operation ? 'table' : 'none'}" class="operation-marker">
                        <div class="close">关闭/Close</div>
                        <div class="operation">
                            <div class="btn delete">删除/Delete</div>
                        </div>
                    </div>
                </div>
			</div>
		</el-form-item>
	</el-form>
</template>

<script>
import MyImage from "./MyImage";
import UploadImage from "./UploadImage";

// let toImageBlock = ele => {
//     while (!ele.classList.contains('image-block')) {
//         ele = ele.parentElement;
//     }
//     return ele;
// };

export default {
	name: "DpdForm",
	components: {UploadImage, MyImage},
	props: {
		offline: {
			type: Boolean,
			default() {
				return false;
			}
		},
		edit: {
			type: Boolean,
			require: true,
		},
		drawerType: {
			type: String,
		},
		formItems: {
			type: Array,
			default() {
				return []
			}
		}
	},
	data() {
		return {
			recordId: '',
			images: {
				sources: [], // 源链接
				urls: [], // base64
			}
		}
	},
	methods: {
        updateImageBase64(base64,ind,target) {
            this.images[target][ind].base64 = base64;
        },
        // target = ['urls','sources']
        doOperate(e,ind,target,imageId) {
            let d = e.target;
            console.log(ind);
            console.log(target);
            console.log(imageId);
            if (d.tagName.toLowerCase() === 'img') {
                // let ib = toImageBlock(d);
                // ib.getElementsByClassName('operation-marker')[0].style.display = 'table';
                this.images[target][ind].operation = true;
            } else if (d.classList.contains('close')) {
                // let ib = toImageBlock(d);
                // ib.getElementsByClassName('operation-marker')[0].style.display = 'none';
                this.images[target][ind].operation = false;
            } else if (d.classList.contains('delete')) {
                this.deleteImage(imageId,target,ind);
            }
        },
        deleteImage(imageId,target,ind) {
            this.$parent.$parent.deleteImage(this.drawerType,imageId).then(() => {
                this.images[target].splice(ind,1);
            });
        },
		updateChange() {
			// if (!this.edit) return;
			let obj = {};
			this.formItems.forEach(o => {
				if (o.value) obj[o.name] = o.value;
			});
			this.$emit('updateChange',obj);
		},
        // 从父组件将要显示的图片列表载入
		setImage(images) {
			console.log(images)
            // 删掉全部图片数据
			this.images.sources.splice(0,this.images.sources.length);
			this.images.urls.splice(0,this.images.urls.length);
            // 载入的全是 sources （即存储在服务器的图片）
			if (images instanceof Array) {
				this.images.sources.splice(0,0,...images.map(_ => {
                    return {
                        ..._,
                        operation: false,
                        base64: '',
                    }
                }));
			}
		},
		handleAvatarSuccess(file) {
            // 新上传的图片
			this.$parent.$parent.handleAvatarSuccess(this.drawerType,file,this.offline).then(({url,id/*,file_path*/}) => {
				this.images.urls.push({
                    imgUrl: url,
                    id,
                    operation: false,
                    base64: '',
                });
				// 将 file_path 提交
			});
		},
	},
	mounted() {
		window.$dpf = this;
	}
}
</script>

<style>
.avatar-uploader {
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
	text-align: center;
	border: 2px dotted gray;
}
.avatar-uploader div{
	width: 100%;
}
.dpp-images {
    min-height: 30px;
}
.dpp-images .image-block {
    position: relative !important;
}
.dpp-images>div>img {
	width: 100%;
	padding-top: 5px;
}
.dpp-images>div>div.operation-marker{
    position: absolute;
    top: 0;
    /*margin-top: 5px;*/
    height: calc(100% - 10px);
    width: 100%;
    background: #808080b5;
    display: table;
}
.dpp-images>div>div .close{
    position: absolute;
    right: 10px;
    color: white;
    font-weight: bold;
}
.dpp-images>div>div>.operation{
    display: table-cell;
    vertical-align: middle;
    text-align: center;
    color: white;
    font-size: 20px;
}
.dpp-images>div>div>.operation .btn{
    display: inline-block;
    padding: 3px 10px;
    background: #2196f3;
    border-radius: 8px;
}
</style>
