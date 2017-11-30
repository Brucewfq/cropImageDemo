function CropImage(el, cropBox, shadow) {
    this.cropBox = cropBox;
    this.shadow = shadow;
    this.el = el;

    if (this.cropBox) {
        this.cropBoxHandle = this.cropBox.getElementsByClassName('box-handle');
    }
    if (el) {
        this.init(el);
    }
}

CropImage.prototype = {
    constructor: "CropImage",
    init: function (el) {
        console.log(el.getBoundingClientRect())
        this.elWidth = el.getBoundingClientRect().right - el.getBoundingClientRect().left;
        this.elHeight = el.getBoundingClientRect().bottom - el.getBoundingClientRect().top;

        this.elOffSetTop = el.getBoundingClientRect().top;
        this.elOffSetLeft = el.getBoundingClientRect().left;

        console.log("elWidth:" + this.elWidth + "elHeight:" + this.elHeight + "elOffSetTop:" + this.elOffSetTop + "elOffSetLeft:" + this.elOffSetLeft)

    },
    crop: function () {

        this.createCropArea();
    },
    createCropArea: function () {
        console.log("start crop");
        //设置裁剪框的长和宽
        _setAssign(this.cropBox, 'width', this.elWidth + 'px');
        _setAssign(this.cropBox, 'height', this.elHeight + 'px');
        _setAssign(this.cropBox, 'top', this.elOffSetTop + 'px');
        _setAssign(this.cropBox, 'left', this.elOffSetLeft + 'px');

        //绘制阴影区域
        _shadow(this.el, this.cropBox, this.shadow);

        //
        var that = this;
        this.cropBox.addEventListener("mousemove", function (event) {
            that.setCropBoxHandleCursor(event)
        }, false);

        this.cropBox.addEventListener("mousedown", function (event) {
            that.stretchCropBox(event);
        }, false);

    },
    setCropBoxHandleCursor: function (event) {
        var currentHandle = event.target;
        switch (currentHandle.id) {
            case 'box_1':                            // 左上

                _setAssign(this.cropBox, 'cursor', 'nw-resize');

                break;
            case 'box_2':                            // 右上

                _setAssign(this.cropBox, 'cursor', 'ne-resize');

                break;
            case 'box_3':                            // 右下
                _setAssign(this.cropBox, 'cursor', 'se-resize');

                break;
            case 'box_4':                            // 左下

                _setAssign(this.cropBox, 'cursor', 'sw-resize');

                break;
            case 'box_5':                            // 上
                _setAssign(this.cropBox, 'cursor', 'n-resize');

                break;
            case 'box_6':                            // 右
                _setAssign(this.cropBox, 'cursor', 'e-resize');

                break;

            case 'box_7':                            // 下
                _setAssign(this.cropBox, 'cursor', 's-resize');

                break;
            case 'box_8':                            // 左
                _setAssign(this.cropBox, 'cursor', 'w-resize');

                break;

            default :                                // 裁剪区域 显示可移动提示
                _setAssign(this.cropBox, 'cursor', 'move');
                break;
        }
    },
    stretchCropBox: function (event) {
        var that = this;

        // event事件对象
        var oEvent = event || window.event;
        // 获取cursor状态
        var oCur = _getCss(this.cropBox, 'cursor');
        // 鼠标初始位置
        var sTmpX = oEvent.clientX;
        var sTmpY = oEvent.clientY;

        // 获取裁剪区域的属性 用一个对象保存起来方便调用
        var _cropBox = {};
        _cropBox.left = _getCss(this.cropBox, 'left');
        _cropBox.top = _getCss(this.cropBox, 'top');
        _cropBox.width = _getCss(this.cropBox, 'width');
        _cropBox.height = _getCss(this.cropBox, 'height');

        document.onmousemove = function (ev) {
            // 移动事件对象
            var oEvent = ev || window.event;
            // 当前鼠标位置减去初始鼠标位置 等于 鼠标移动距离
            var mouseMoveDisX = oEvent.clientX - sTmpX;
            var mouseMoveDisY = oEvent.clientY - sTmpY;

            // 鼠标移动需要改变的值
            var cropBoxWidth = '';
            var cropBoxHeight = '';
            var cropBoxTop = '';
            var cropBoxLeft = '';

            switch (oCur) {
                case 'nw-resize' :           // 左上

                    cropBoxWidth = parseInt(_cropBox.width) - mouseMoveDisX;
                    cropBoxHeight = parseInt(_cropBox.height) - mouseMoveDisY;
                    cropBoxLeft = parseInt(_cropBox.left) + mouseMoveDisX;
                    cropBoxTop = parseInt(_cropBox.top) + mouseMoveDisY;

                    break;
                case 'ne-resize' :           // 右上
                    // 此时width不能减去鼠标移动距离 因为此时移动距离为正值
                    cropBoxWidth = parseInt(_cropBox.width) + mouseMoveDisX;
                    cropBoxHeight = parseInt(_cropBox.height) - mouseMoveDisY;
                    // 右上角移动不需要left值 因为默认响右移动
                    cropBoxTop = parseInt(_cropBox.top) + mouseMoveDisY;

                    break;
                case 'sw-resize' :           // 左下
                    // 同右上  height 必须是加上鼠标移动距离
                    cropBoxWidth = parseInt(_cropBox.width) - mouseMoveDisX;
                    cropBoxHeight = parseInt(_cropBox.height) + mouseMoveDisY;
                    cropBoxLeft = parseInt(_cropBox.left) + mouseMoveDisX;

                    break;
                case 'se-resize' :           // 右下
                    // 左下与右上的结合 同时去除left与top
                    cropBoxWidth = parseInt(_cropBox.width) + mouseMoveDisX;
                    cropBoxHeight = parseInt(_cropBox.height) + mouseMoveDisY;

                    break;
                case 'n-resize'  :           // 上

                    cropBoxHeight = parseInt(_cropBox.height) - mouseMoveDisY;
                    cropBoxTop = parseInt(_cropBox.top) + mouseMoveDisY;

                    break;
                case 'w-resize'  :          // 左

                    cropBoxWidth = parseInt(_cropBox.width) - mouseMoveDisX;
                    cropBoxLeft = parseInt(_cropBox.left) + mouseMoveDisX;

                    break;
                case 's-resize'  :          // 下

                    cropBoxHeight = parseInt(_cropBox.height) + mouseMoveDisY;

                    break;
                case 'e-resize'  :          // 右

                    cropBoxWidth = parseInt(_cropBox.width) + mouseMoveDisX;

                    break;
                default :
                    // 否则是移动裁剪区域
                    //tailorMove(oEvent , oTailor , oPicture , oShadow);
                    that.moveCropBox(event, that.cropBox, that.el, that.shadow);

                    break;
            }

            // 向上拉到边界
            /* var pictureHeight = that.el.getBoundingClientRect().bottom - that.el.getBoundingClientRect().top;
             if (parseInt(_getCss(that.cropBox, 'top')) <= that.el.offsetTop) {
                 cropBoxHeight = parseInt(pictureHeight) - (that.el.offsetTop + parseInt(pictureHeight) - parseInt(_getCss(that.cropBox, 'top')) - parseInt(_getCss(that.cropBox, 'height')));
                 cropBoxTop = that.el.offsetTop;
             } else if (that.el.offsetTop + parseInt(pictureHeight) <= (parseInt(_getCss(that.cropBox, 'top')) + parseInt(_getCss(that.cropBox, 'height')))) {
                 // 向下拉到边界
                 cropBoxHeight = that.el.offsetTop + parseInt(pictureHeight) - parseInt(_getCss(that.cropBox, 'top'));
             }*/

            // 向左拉到边界
            /*if ((parseInt(_getCss(that.cropBox, 'left'))) <= that.el.offsetLeft) {
                oTmpWidth = parseInt(_getCss(that.el, 'width')) - (that.el.offsetLeft + parseInt(_getCss(that.el), 'width') - parseInt(_getCss(that.cropBox, 'left')) - parseInt(_getCss(that.cropBox, 'width')))
                oTmpLeft = that.el.offsetLeft;
            } else if (parseInt(_getCss(that.cropBox, 'width')) + parseInt(_getCss(that.cropBox, 'left')) >= (that.el.offsetLeft + that.el.offsetWidth)) {
                // 向右拉到边界
                oTmpWidth = that.el.offsetLeft + that.el.offsetWidth - parseInt(_getCss(that.cropBox, 'left'));
            }*/

            /*if (parseInt(that.cropBox.getBoundingClientRect().right) > parseInt(that.el.getBoundingClientRect().right)) {
                console.log(_cropBox.width + "=============")
                cropBoxWidth = parseInt(_cropBox.width) + mouseMoveDisX;
                cropBoxHeight = parseInt(_cropBox.height) + mouseMoveDisY;
            }*/


            /*console.log(cropBoxWidth)
            console.log(cropBoxHeight)
            if (that.el.offsetTop + parseInt(that.elHeight) <= (parseInt(_getCss(that.cropBox, 'top')) + parseInt(_getCss(that.cropBox, 'height')))) {
                cropBoxHeight = that.el.offsetTop + parseInt(that.elHeight) - parseInt(_getCss(that.cropBox, 'top'))
            }
            if (cropBoxWidth >= that.elWidth) {
                cropBoxWidth = that.elWidth
            }
            console.log(cropBoxWidth + "=============")
            console.log(cropBoxHeight + "==============")*/

            // 赋值
            if (cropBoxWidth) {
                _setAssign(that.cropBox, 'width', cropBoxWidth + 'px');
            }
            if (cropBoxHeight) {

                _setAssign(that.cropBox, 'height', cropBoxHeight + 'px');

            }
            if (cropBoxLeft) {
                _setAssign(that.cropBox, 'left', cropBoxLeft + 'px');

            }
            if (cropBoxTop) {
                _setAssign(that.cropBox, 'top', cropBoxTop + 'px');

            }

            _shadow(that.el, that.cropBox, that.shadow);

        };

        // 当松开鼠标时注意取消移动事件
        document.onmouseup = function (ev) {
            // event事件对象
            var oEvent = ev || window.event;

            document.onmousemove = null;
            oEvent.preventDefault();
        };

        oEvent.preventDefault();
    },
    moveCropBox: function (event, oTailor, oPicture, oShadow) {

        var oEvent = event || window.event;

        var oTmpx = oEvent.clientX - oTailor.offsetLeft;
        var oTmpy = oEvent.clientY - oTailor.offsetTop;

        document.onmousemove = function (ev) {
            var oEvent = ev || window.event;

            oLeft = oEvent.clientX - oTmpx;
            oTop = oEvent.clientY - oTmpy;


            if (oLeft < oPicture.offsetLeft) {
                oLeft = oPicture.offsetLeft;
            } else if (oLeft > (oPicture.offsetLeft + oPicture.offsetWidth - oTailor.offsetWidth)) {
                oLeft = oPicture.offsetLeft + oPicture.offsetWidth - oTailor.offsetWidth;
            }
            if (oTop < oPicture.offsetTop) {
                oTop = oPicture.offsetTop;
            } else if (oTop > (oPicture.offsetTop + oPicture.offsetHeight - oTailor.offsetHeight)) {
                oTop = oPicture.offsetTop + oPicture.offsetHeight - oTailor.offsetHeight;
            }

            oTailor.style.left = ( oLeft) + 'px';
            oTailor.style.top = (oTop) + 'px';
            _shadow(oPicture, oTailor, oShadow);
        }

    },
    destroy: function () {

    }
};

function _setAssign(obj, option, value) {

    switch (option) {
        case 'width':
            obj.style.width = value;
            break;
        case 'height':
            obj.style.height = value;
            break;
        case 'top':
            obj.style.top = value;
            break;
        case 'left':
            obj.style.left = value;
            break;
        case 'position':
            obj.style.position = value;
            break;
        case 'cursor':
            obj.style.cursor = value;
    }
}

function _getCss(obj, key) {
    return obj.currentStyle ? obj.currentStyle[key] : document.defaultView.getComputedStyle(obj, false)[key];
}

function _shadow(oPicture, oTailor, oShadow) {
    // console.log(oTailor.getBoundingClientRect().top)
    //console.log(_getCss(oPicture, 'top'))
    // 上侧阴影区
    _setAssign(oShadow[0], 'width', parseInt(_getCss(oTailor, 'width')) + 'px');
    _setAssign(oShadow[0], 'height', (parseInt(oTailor.getBoundingClientRect().top) - parseInt(oPicture.getBoundingClientRect().top)) + 'px');
    _setAssign(oShadow[0], 'left', (parseInt(oTailor.getBoundingClientRect().left)) + 'px');
    _setAssign(oShadow[0], 'top', parseInt(oPicture.getBoundingClientRect().top) + 'px');

    //右侧阴影区
    _setAssign(oShadow[1], 'width', (parseInt(oPicture.getBoundingClientRect().right) - parseInt(oTailor.getBoundingClientRect().right)) + 'px');
    _setAssign(oShadow[1], 'height', parseInt(_getCss(oPicture, 'height')) + 'px');
    _setAssign(oShadow[1], 'left', (parseInt(oTailor.getBoundingClientRect().right)) + 'px');
    _setAssign(oShadow[1], 'top', parseInt(oPicture.getBoundingClientRect().top) + 'px');

    // 下侧阴影区
    _setAssign(oShadow[2], 'width', parseInt(_getCss(oTailor, 'width')) + 'px');
    _setAssign(oShadow[2], 'height', (parseInt(oPicture.getBoundingClientRect().bottom - oTailor.getBoundingClientRect().bottom)) + 'px');
    _setAssign(oShadow[2], 'left', (parseInt(oTailor.getBoundingClientRect().left)) + 'px');
    _setAssign(oShadow[2], 'top', (parseInt(oTailor.getBoundingClientRect().bottom)) + 'px');

    // 左侧阴影区
    _setAssign(oShadow[3], 'width', (parseInt(oTailor.getBoundingClientRect().left - oPicture.getBoundingClientRect().left)) + 'px');
    _setAssign(oShadow[3], 'height', parseInt(_getCss(oPicture, 'height')) + 'px');
    _setAssign(oShadow[3], 'left', parseInt(oPicture.getBoundingClientRect().left) + 'px');
    _setAssign(oShadow[3], 'top', parseInt(oPicture.getBoundingClientRect().top) + 'px');
}

