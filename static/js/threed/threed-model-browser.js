// 对外暴露的接口

// 加载模型
function loadModel( objUrl, textureUrl, mtlUrl ) {

    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

    if (_exhibitModel!=null) {
        return;
    }

    if (_modelStatusCallback) {
        _modelStatusCallback("start");
    }

    removeAllHotSpots();

    // 检测是不是mtl文件
    //var ext = textureUrl.substring(textureUrl.length - 4, textureUrl.length);
    //ext = ext.toLowerCase();

    //_loadModelByMtl("models/obj/male02/male02.obj", "models/obj/male02/male02_dds.mtl");

    //if (  mtlUrl != null) {
    if ( mtlUrl ) {
        _loadModelByMtl(objUrl, mtlUrl, textureUrl);
    }
    else {
        _loadModelByTexture(objUrl, textureUrl);
    }

    var meshMaterial = new THREE.MeshNormalMaterial();
    meshMaterial.side = THREE.DoubleSide;
    var wireFrameMat = new THREE.MeshBasicMaterial();
    wireFrameMat.wireframe = true;

    _cameraTarget = THREE.SceneUtils.createMultiMaterialObject(new THREE.SphereGeometry(5), [meshMaterial, wireFrameMat]);
    _cameraTarget.visible = _cameraEdittingEnabled;
    _scene.add(_cameraTarget);

    _cameraTargetControl = new THREE.TransformControls(_mainCamera, _renderer.domElement);
    _scene.add(_cameraTargetControl);
    _cameraTargetControl.setMode("translate");
    if (_cameraEdittingEnabled) {
        _cameraTargetControl.attach(_cameraTarget);
    }

    _mainCamera.position.set(150, 150, 150);
    _mainCamera.up.set(0, 1, 0);
    _mainCamera.lookAt(0, 0, 0);

    var controller_div = "canvas";
    setControlsDom(controller_div);   //控制器

    createjs.Ticker.setFPS(60);
}

var $_controller;


function html2canvas_init (){
    var canvas =  _renderer.domElement;

    var image = new Image();
    image.src = canvas.toDataURL("image/png");

    return image.src;
}

function setControlsDom( controller_div ) {
    if( controller_div == "canvas"){
        $_controller = _renderer.domElement;
    }
    else{
        $_controller = document.getElementsByClassName("hotSpot_div")[0];
    }

    _trackballControls($_controller);
}
function _loadModelByTexture(objUrl, textureUrl) {
    //导入材质
    var materialLoaded = false;
    var texture = _textureLoader.load(textureUrl, function () {
        //console.log("texture loaded");
        materialLoaded = true;
        if (_exhibitModel) {
            _exhibitModel.visible = true;
        }
    });

    var onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            var percentComplete = xhr.loaded / xhr.total * 100;
            //console.log(Math.round(percentComplete, 2) + '% downloaded');
            if (_modelStatusCallback) {
                _modelStatusCallback("progress", percentComplete);
            }
        }
    };
    var onError = function (xhr) { };

    //导入模型
    _clippingPlanes = [null, null];
    _clippingPlanes[0] = new THREE.Plane(new THREE.Vector3(1, 0, 0), 999999999);
    _clippingPlanes[1] = new THREE.Plane(new THREE.Vector3(1, 0, 0), 999999999);

    _objLoader.load(objUrl, function (geometry) {

        geometry.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = texture;
                child.material.clippingPlanes = _clippingPlanes;
                child.material.side = THREE.DoubleSide;
            }
        });

        _exhibitModel = geometry;
        _exhibitModel.visible = false;
        if (materialLoaded) {
            _exhibitModel.visible = true;
        }


        _scene.add(_exhibitModel);
        if (_modelStatusCallback) {
            _modelStatusCallback("loaded");
        }

        // create transparent child
        _objLoader.load(objUrl, function (transparentGeometry) {

            transparentGeometry.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material.map = texture;
                    child.material.side = THREE.DoubleSide;
                    child.material.transparent = true;
                    child.material.opacity = 0.1;
                }
            });

            _transParentExhibitModel = transparentGeometry;
            _transParentExhibitModel.visible = false;
            _exhibitModel.add(_transParentExhibitModel);
        }, null, null);

    }, onProgress, onError);
}

function _loadModelByMtl(objUrl, mtlUrl, textureUrl) {

    var onProgress111 = function (xhr) {
    };
    var onErro111r = function (xhr) { };

    var texture = _textureLoader.load( textureUrl, function () {
        //console.log("texture loaded");
        //materialLoaded = true;
        //if (_exhibitModel) {
        //    _exhibitModel.visible = true;
        //}
    });

    _clippingPlanes = [null, null];
    _clippingPlanes[0] = new THREE.Plane(new THREE.Vector3(1, 0, 0), 999999999);
    _clippingPlanes[1] = new THREE.Plane(new THREE.Vector3(1, 0, 0), 999999999);

    var loader = new THREE.MTLLoader();

    var fileSlashIndex = mtlUrl.lastIndexOf("/");
    var mtlFileName = mtlUrl.substring(fileSlashIndex + 1, mtlUrl.length);
    var mtlUrlRoot = mtlUrl.substring(0, fileSlashIndex + 1);

    loader.setPath(mtlUrlRoot);
    loader.load(mtlFileName, function (materials) {
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		objLoader.setMaterials(materials);
		//objLoader.setPath('models/obj/male02/');
		objLoader.load(objUrl, function (object) {
		    object.traverse(function (child) {
		        if (child instanceof THREE.Mesh) {
		            child.material.map = texture;
		            child.material.clippingPlanes = _clippingPlanes;
		            child.material.side = THREE.DoubleSide;
		        }
		    });

		    _exhibitModel = object;
		    _scene.add(_exhibitModel);
		    if (_modelStatusCallback) {
		        _modelStatusCallback("loaded");
		    }
		}, onProgress111, onErro111r);


        // create transparent child
		var transObjLoader = new THREE.OBJLoader();
		transObjLoader.load(objUrl, function (transparentGeometry) {

		    transparentGeometry.traverse(function (child) {
		        if (child instanceof THREE.Mesh) {
		            child.material.map = texture;
		            child.material.side = THREE.DoubleSide;
		            child.material.transparent = true;
		            child.material.opacity = 0.1;
		        }
		    });

		    _transParentExhibitModel = transparentGeometry;
		    _transParentExhibitModel.visible = false;
		    _exhibitModel.add(_transParentExhibitModel);
		}, null, null);

	});
}

function showRuler(mode) {

    if (_clippingPlaneControl1 != null) {
        hideRuler();
    }

    _rulerMode = mode;

    if (_exhibitModel == null) {
        return;
    }
    if (_clippingPlaneNode1) {
        return;
    }

    if (_transParentExhibitModel) {
        _transParentExhibitModel.visible = true;
    }

    // 计算出距离摄像机距离观察点的距离,来决定尺子的初始距离
    var cameraPos = _mainCamera.position.clone();
    var cameraTarget = _controller.target.clone();
    var defaultDistance = cameraPos.distanceTo(cameraTarget) / 3;

    var meshMaterial = new THREE.MeshNormalMaterial();
    meshMaterial.side = THREE.DoubleSide;
    var wireFrameMat = new THREE.MeshBasicMaterial();
    wireFrameMat.wireframe = true;

    //_localPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);

    _clippingPlaneNode1 = THREE.SceneUtils.createMultiMaterialObject(new THREE.SphereGeometry(2), [meshMaterial, wireFrameMat]);

    if (_rulerMode == "x") {
        _clippingPlaneNode1.position.set(-defaultDistance / 2, 0, 0);
    }
    else if (_rulerMode == "y") {
        _clippingPlaneNode1.position.set(0, -defaultDistance / 2, 0);
    }
    else if (_rulerMode == "z") {
        _clippingPlaneNode1.position.set(0, 0,-defaultDistance / 2);
    }
    else {
        _clippingPlaneNode1.position.set(-defaultDistance / 2, 0, 0);
    }

    _exhibitModel.add(_clippingPlaneNode1);
    _clippingPlaneControl1 = new THREE.TransformControls(_mainCamera, _renderer.domElement);
    _clippingPlaneControl1.addEventListener('change', _onClippingPlaneControlChanged);
    _clippingPlaneControl1.attach(_clippingPlaneNode1);
    _clippingPlaneNode1.visible = false;
    _exhibitModel.add(_clippingPlaneControl1);

    _clippingPlaneNode2 = THREE.SceneUtils.createMultiMaterialObject(new THREE.SphereGeometry(2), [meshMaterial, wireFrameMat]);

    if (_rulerMode == "x") {
        _clippingPlaneNode2.position.set(defaultDistance / 2, 0, 0);
    }
    else if (_rulerMode == "y") {
        _clippingPlaneNode2.position.set(0, defaultDistance / 2, 0);
    }
    else if (_rulerMode == "z") {
        _clippingPlaneNode2.position.set(0, 0, defaultDistance / 2);
    }
    else {
        _clippingPlaneNode2.position.set(defaultDistance / 2, 0, 0);
    }

    _exhibitModel.add(_clippingPlaneNode2);
    _clippingPlaneControl2 = new THREE.TransformControls(_mainCamera, _renderer.domElement);
    _clippingPlaneControl2.addEventListener('change', _onClippingPlaneControlChanged);
    _clippingPlaneControl2.attach(_clippingPlaneNode2);
    _clippingPlaneNode2.visible = false;
    _exhibitModel.add(_clippingPlaneControl2);

    var linkMaterial = new THREE.LineBasicMaterial({ color: 0xff5300 });
    linkMaterial.depthTest = false;
    linkMaterial.linewidth = 5;
    var geometry = new THREE.Geometry();
    geometry.vertices.push(_clippingPlaneControl1.position.clone());
    geometry.vertices.push(_clippingPlaneControl2.position.clone());
    //线构造
    _rulerLine = new THREE.Line(geometry, linkMaterial);
    _rulerLine.geometry.dynamic = true;
    // 加入到场景中
    _exhibitModel.add(_rulerLine);

    _rulerResult = document.createElement('div');
    _rulerResult.style.position = 'absolute';
    //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
    _rulerResult.style.width = 100;
    _rulerResult.style.height = 100;
    _rulerResult.style.backgroundColor = "transparent";
    _rulerResult.style.color = "#ff5300";
    _rulerResult.innerHTML  = "200 mm";
    _rulerResult.style.top  = 200 + 'px';
    _rulerResult.style.left = 200 + 'px';
    _rulerResult.style.fontSize   = '16px';
    _rulerResult.style.fontWeight = 'bold';
    document.body.appendChild(_rulerResult);

    _onClippingPlaneControlChanged();
}

function setRulerMode(mode) {
    _rulerMode = mode;
}

var _rulerResult;
var _rulerMode = "y";

function hideRuler() {
    if (_transParentExhibitModel) {
        _transParentExhibitModel.visible = false;
    }

    if (_clippingPlaneControl1==null) {
        return;
    }

    _clippingPlaneControl1.detach(_clippingPlaneNode1);
    _clippingPlaneControl2.detach(_clippingPlaneNode2);
    _exhibitModel.remove(_clippingPlaneNode1);
    _clippingPlaneNode1 = null;
    _exhibitModel.remove(_clippingPlaneControl1);
    _clippingPlaneControl1 = null;
    _exhibitModel.remove(_clippingPlaneNode2);
    _clippingPlaneNode2 = null;
    _exhibitModel.remove(_clippingPlaneControl2);
    _clippingPlaneControl2 = null;
    _exhibitModel.remove(_rulerLine);
    _rulerLine = null;

    _clippingPlanes[0] = new THREE.Plane(new THREE.Vector3(1, 0, 0), 999999999);
    _clippingPlanes[1] = new THREE.Plane(new THREE.Vector3(1, 0, 0), 999999999);

    document.body.removeChild(_rulerResult);
}

//function camera() {
//    createjs.Tween.get(_exhibitModel.position).to({ x: 100, y: 100, z: 100 }, 10000).call(function () { alert("asdfasdfasdfasdf"); });
//}

function _onClippingPlaneControlChanged() {
    if (_clippingPlaneControl1 == null) {
        return;
    }

    var p1 = _clippingPlaneControl1.position.clone();
    var p2 = _clippingPlaneControl2.position.clone();

    if (_rulerMode == "x") {
        p2.y = p1.y;
        p2.z = p1.z;
    }
    else if (_rulerMode == "y") {
        p2.x = p1.x;
        p2.z = p1.z;
    }
    else if (_rulerMode == "z") {
        p2.x = p1.x;
        p2.y = p1.y;
    }

    var normal1 = new THREE.Vector3(0,0,0);
    normal1.subVectors(p2,p1);
    normal1.normalize();
    var normal2 = new THREE.Vector3(0,0,0);
    normal2.subVectors(p1,p2);
    normal2.normalize();

    _clippingPlanes[0].setFromNormalAndCoplanarPoint(normal1, p1);
    _clippingPlanes[1].setFromNormalAndCoplanarPoint(normal2, p2);

    _rulerLine.geometry.vertices[0] = p1.clone();
    _rulerLine.geometry.vertices[1] = p2.clone();
    _rulerLine.geometry.verticesNeedUpdate = true;

    _updateRulerValue();
    _updateRulerResultPos();
}

function _updateRulerResultPos() {
    if (_clippingPlaneControl1 == null) {
        return;
    }

    var p1, p2;
    if (_clippingPlaneControl1) {
        p1 = _clippingPlaneControl1.position.clone();
    }
    if (_clippingPlaneControl2) {
        p2 = _clippingPlaneControl2.position.clone();
    }

    if (_rulerResult) {
        var p111 = p1.clone();
        var middle = p2.sub(p111);
        middle.divideScalar(2);
        p1.add(middle);

        var screenPos = _worldPosToScreenPos(p1);
        _rulerResult.style.left = (screenPos.x - (_rulerResult.offsetWidth/2)) + 'px';
        _rulerResult.style.top = screenPos.y + 'px';
    }
}

function _updateRulerValue() {
    if (_clippingPlaneControl1 == null) {
        return;
    }

    var p1, p2;
    if (_clippingPlaneControl1) {
        p1 = _clippingPlaneControl1.position.clone();
    }
    if (_clippingPlaneControl2) {
        p2 = _clippingPlaneControl2.position.clone();
    }

    var distance = p1.distanceTo(p2);
    if (distance <= 1000.0) {
        _rulerResult.innerHTML = distance.toFixed(2) + " mm";
    }
    else {
        _rulerResult.innerHTML = (distance/10.0).toFixed(2) + " cm";
    }
}

function unloadModel() {
    hideRuler();

    if (_exhibitModel) {
        _exhibitModel.remove(_transParentExhibitModel);
        _transParentExhibitModel = null;
        removeAllHotSpots();
        _scene.remove(_exhibitModel);
        _exhibitModel = null;
        _scene.remove(_cameraTarget);
    }

    if (_cameraTarget) {
        _scene.remove(_cameraTarget);
    }
    if (_cameraTargetControl) {
        _scene.remove(_cameraTargetControl);
    }

    if (_modelStatusCallback) {
        _modelStatusCallback("unloaded");
    }
}

// 添加热点
function addHotSpot(id, posX, posY, posZ) {
    if (_hotSpots.hasOwnProperty(id)) {
        return;
    }
    if (_hotSpots && _exhibitModel) {
        var newHotSpot = new Object();
        var control = new THREE.TransformControls(_mainCamera, _renderer.domElement);

        var meshMaterial = new THREE.MeshNormalMaterial();
        meshMaterial.side = THREE.DoubleSide;
        var wireFrameMat = new THREE.MeshBasicMaterial();
        wireFrameMat.wireframe = true;

        var hotSpotNode = THREE.SceneUtils.createMultiMaterialObject(new THREE.BoxGeometry(5, 5, 5), [meshMaterial, wireFrameMat]);
        hotSpotNode.visible = false;
        _exhibitModel.add(hotSpotNode);
        _exhibitModel.add(control);
        hotSpotNode.position.set(posX, posY, posZ);
        control.hotSpotId = id;
        control.setMode("translate");
        control.setSpace("local");
        control.addEventListener('change', _hotSpotTransformChanged);

        newHotSpot.control = control;
        newHotSpot.hotSpotNode = hotSpotNode;
        _hotSpots[id] = newHotSpot;

        _callHotSpotScreenPosCallback(id);

        //if (true) {
        //    newHotSpot.control.attach(newHotSpot.hotSpotNode);
        //    newHotSpot.hotSpotNode.visible = true;
        //}
    }
}

// 移除热点
function removeHotSpot( id ) {
    if (!_hotSpots.hasOwnProperty(id)) {
        return;
    }

    var hotSpot = _hotSpots[id];
    if (hotSpot) {
        _exhibitModel.remove(hotSpot.hotSpotNode);
        _exhibitModel.remove(hotSpot.control);
    }

    delete _hotSpots[id];
}

function removeAllHotSpots() {
    if (_exhibitModel) {
        for (var id in _hotSpots) {
            _exhibitModel.remove(_hotSpots[id].hotSpotNode);
            _exhibitModel.remove(_hotSpots[id].control);
        }
    }
    _hotSpots = new Object();
}

// 更新热点位置
function setHotSpotPos(id, posX, posY, posZ) {
    if (_hotSpots.hasOwnProperty(id)) {
        _hotSpots[id].hotSpotNode.position.set(posX, posY, posZ);
    }
}

function getHotSpotPosition(id) {
    if (_hotSpots.hasOwnProperty(id)) {
        var pos = _hotSpots[id].hotSpotNode.position.clone();
        return _worldPosToScreenPos(pos);
    }
}

// 设置屏幕位置更新回调
//callback定义: hotSpotScreenPosCallback( id, x, y )
function setHotSpotScreenPosCallback(callback) {
    _hotSpotScreenCallback = callback;
}
var _hotSpotScreenCallback;

//callback定义: hotSpotEditingCallback( id, x, y, x )
function setHotSpotEditingCallback(callback) {
    _hotSpotEditingCallback = callback;
}
var _hotSpotEditingCallback;

// calback定义: modelStatusCallback( event, param );
// event取值: 
//  "start" 模型开始加载
//  "progress", param: 0-100  模型加载进度
// "loaded"  模型加载完成
// "unloaded"  模型卸载完成
function setModelStateCallback(callback) {
    _modelStatusCallback = callback;
}
var _modelStatusCallback;

function setCameraStatusCallback(callback) {
    _cameraStatusCallback = callback;
    _callCameraStatusCallback();
}

var _cameraStatusCallback;

function setRulerCallback(callback) {
    _rulerCallback = callback;
}
var _rulerCallback;

// 设置光照方案,从0开始
function setLightingScheme(index) {
    if (index == 0) {
        _lightingScheme0();
    }
    else if (index == 1) {
        _lightingScheme1();
    }
    else if (index == 2) {
        _lightingScheme2();
    }
    else if (index == 3) {
        _lightingScheme3();
    }
}

// 获取当前灯光方案
function getLightingScheme() {
    return _currentLightingScheme;
}

// 设置摄像机参数
// x, y, z, 观看点
// distance 默认距离
function setCameraParam(x, y, z, distance) {
    if (_controller) {
        _controller.reset();
        _controller.target = new THREE.Vector3(x, y, z);
        
        _controller.minDistance = distance / 3;
        _controller.maxDistance = distance * 2;
    }

    _cameraDefaultTarget = new THREE.Vector3(0, 0, 0);
    _cameraDefaultTarget.set(x, y, z);
    _camermaDefaultDistance = distance;

    if (distance) {
        var target = _controller.target.clone();
        var offset = new THREE.Vector3(1, 1, 1);
        offset.normalize();
        offset.multiplyScalar(distance);
        var cameraPosition = target.add(offset);
        _mainCamera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    }

    if (_cameraTarget) {
        _cameraTarget.position.set(x, y, z);
    }
    
    _dirtyCameraResetFlag = true;
}

var _dirtyCameraResetFlag = false;

// 设置相机观察点
// target: 观察点坐标 {x:0, y:0, z:0}
// cameraPos: 摄像机坐标 {x:0, y:0, z:0}
// time: 动画持续时间,单位毫秒
function setCameraObservePoint(target, cameraPos, time) {
    if (_controller) {
        _currentCameraAniTarget = _controller.target.clone();
    }
    
    if (_controller) {
        _controller.removeEventListener('change', _onTrackballControlChanged);
        _controller.dispose();
        _controller = null;
    }

    createjs.Tween.get(_currentCameraAniTarget).to({ x: target.x, y: target.y, z: target.z }, time).call(function () {

    }).addEventListener("change",handleChange1);

    function handleChange1(event) {
        //console.log(_currentTarget.x + "_" + _currentTarget.y + "_" + _currentTarget.z)
        _mainCamera.up.set(0, 1, 0);
        _mainCamera.lookAt(_currentCameraAniTarget.x, _currentCameraAniTarget.y, _currentCameraAniTarget.z);
    }

    createjs.Tween.get(_mainCamera.position).to({ x: cameraPos.x, y: cameraPos.y, z: cameraPos.z }, time).addEventListener("change",
    handleChange2);

    function handleChange2(event) {
    }
}
var _currentCameraAniTarget;

// 重置摄像机
function resetCamera() {
    _mainCamera.position.set(150, 150, 150);
    _mainCamera.up.set(0, 1, 0);
    _mainCamera.lookAt(0, 0, 0);

    _trackballControls($_controller);
    setCameraParam(_cameraDefaultTarget.x, _cameraDefaultTarget.y, _cameraDefaultTarget.z, _camermaDefaultDistance);
}

// 设置背景图片
function setBackground( url ) {
    _initBackground(url);
}

// 设置环境贴图
function setTextureCube( url ) {

}

function setBackgroundColor( color ) {
    _renderer.setClearColor( color, 1 );
}

// 进入编辑模式
// enabled为true则切换到编辑模式,出现热点移动工具,摄像机观察点工具等
// type取值:
//      camera: 摄像机编辑
//      hotspot: 热点编辑
function setCameraEdittingEnabled(enabled) {
    _cameraEdittingEnabled = enabled;

    if (enabled) {
        _controller.minDistance = 0.5;
        _controller.maxDistance = 999999;
    }
    else {

    }

    if (_cameraTarget) {
        _cameraTarget.visible = _cameraEdittingEnabled;
        if (_cameraEdittingEnabled) {
            _cameraTargetControl.attach(_cameraTarget);
        }
        else {
            _cameraTargetControl.detach(_cameraTarget);
        }
    }

    if (_cameraEdittingEnabled) {
        _callCameraStatusCallback();
    }
}

function setHotSpotEdittingEnabled(id,enabled) {
    if (_hotSpots.hasOwnProperty(id)) {
        var hotSpot = _hotSpots[id];
        if (hotSpot) {
            if (enabled) {
                hotSpot.control.attach(hotSpot.hotSpotNode);
                hotSpot.hotSpotNode.visible = true;
            }
            else {
                hotSpot.control.detach();
                hotSpot.hotSpotNode.visible = false;
            }
        }
    }

    // 热点编辑控制器
    //for (var id in _hotSpots) {
    //    var hotSpot = _hotSpots[id];
    //    if (hotSpot) {
    //        if (_hotSpotEdittingEnabled) {
    //            hotSpot.control.attach(hotSpot.hotSpotNode);
    //            hotSpot.hotSpotNode.visible = true;
    //        }
    //        else {
    //            hotSpot.control.detach();
    //            hotSpot.hotSpotNode.visible = false;
    //        }
    //    }
    //}
}

function setAllHotSpotEdittingEnabled(enabled) {
    for (var id in _hotSpots) {
        var hotSpot = _hotSpots[id];
        if (hotSpot) {
            if (enabled) {
                hotSpot.control.attach(hotSpot.hotSpotNode);
                hotSpot.hotSpotNode.visible = true;
            }
            else {
                hotSpot.control.detach();
                hotSpot.hotSpotNode.visible = false;
            }
        }
    }
}

// 以下为内部实现

window.onload = function () {
    _start();
};

//var backimgUrl = window.parent.backend_cdn_url+"img/threed/back_img1.jpg";

if (!Detector.webgl) Detector.addGetWebGLMessage();

var _webContainer;

var _renderer, _stats;

var _ambientlight, _directionalLight;
var _gridHelper;

var _loadingManager;
var _textureLoader;
var _objLoader;

var _scene;
var _mainCamera;
var _composer;

var _exhibitModel;
var _transParentExhibitModel;

var _clippingPlanes;
var _clippingPlanesTransp;
var _clippingPlaneControl1;
var _clippingPlaneNode1;
var _clippingPlaneControl2;
var _clippingPlaneNode2;
var _rulerLine;

var _backgroundCamera;
var _backgroundScene;
var _backgroundMesh;

var _controller;
var _cameraDefaultTarget;
var _camermaDefaultDistance;

var _realWidth, _realHeight;

var _cameraEdittingEnabled = false;

var _cameraTarget;
var _cameraTargetControl;

// _hotSpot结构
//{
//    hotSpotNode: null;    // 节点
//    control: null;        // 控制器
//}
var _hotSpots = new Object();

// 灯光方案
var _currentLightingScheme = 0;

function _start() {
    _updateRealSize();

    _initThree();           //初始化引擎
    _createScene();

    window.addEventListener('resize', _onWindowResize, false);

    _renderer.domElement.addEventListener("mouseup", _onPointerUp, false);
    _renderer.domElement.addEventListener("mouseout", _onPointerUp, false);
    _renderer.domElement.addEventListener("touchend", _onPointerUp, false);
    _renderer.domElement.addEventListener("touchcancel", _onPointerUp, false);
    _renderer.domElement.addEventListener("touchleave", _onPointerUp, false);

    _updateFrame();
}

function _onPointerUp(event) {
    if (_controller) {
        var target = _controller.target.clone();
        var cameraPos = _mainCamera.position.clone();
        var offset = cameraPos.sub(target);

        if (_controller && _cameraTarget) {
            _controller.target = new THREE.Vector3(_cameraTarget.position.x, _cameraTarget.position.y, _cameraTarget.position.z);

            target = _controller.target.clone();
            var newOffset = target.add(offset);
            _mainCamera.position.set(newOffset.x, newOffset.y, newOffset.z);

            _callCameraStatusCallback();
        }
    }
}

function _callCameraStatusCallback() {
    if (_cameraEdittingEnabled && _cameraStatusCallback && _controller) {
        var cameraPos = _mainCamera.position.clone();
        var target = _controller.target.clone();
        var distance = cameraPos.distanceTo(target);
        _cameraStatusCallback(_controller.target.x, _controller.target.y, _controller.target.z, distance);
    }
}

function _updateRealSize() {
    realWidth = window.innerWidth;
    realHeight = window.innerHeight;
}

// 初始化引擎
function _initThree() {
    _updateRealSize();

    _renderer = new THREE.WebGLRenderer({antialias:true,       //是否开启反锯齿
        precision:"highp",    //着色精度选择  
        alpha:true,           //是否可以设置背景色透明  
        preserveDrawingBuffer: true, //是否保存绘图缓冲
        logarithmicDepthBuffer: true,
    });
    _renderer.setClearColor(new THREE.Color(255, 255, 255));
    _renderer.setPixelRatio(window.devicePixelRatio);
    _renderer.setSize(realWidth, realHeight);
    //alert(realWidth + "*" + realHeight);

    _renderer.shadowMap.enabled = false;

	var globalPlane = new THREE.Plane( new THREE.Vector3( - 1, 0, 0 ), 0.1 );
	var globalPlanes = [ globalPlane ];

	_renderer.localClippingEnabled = true;
	//_renderer.clippingPlanes = globalPlanes;

    //_webContainer = ;
    //_webContainer.append(_renderer.domElement);

    _webContainer = document.getElementsByClassName("canvas_div")[0];
    _webContainer.appendChild(_renderer.domElement);

    _renderer.setClearColor( 0x42424d, 1);

    _objLoader = new THREE.OBJLoader();
    _loadingManager = new THREE.LoadingManager();
    _loadingManager.onProgress = function (item, loaded, total) {
        //console.log(item, loaded, total);
    };
    _textureLoader = new THREE.TextureLoader(_loadingManager);
    //_textureLoader.wrapS = 1001;
    //_textureLoader.wrapT = 1001;
}

function _initBGCamera() {

}

function _initLights() {
    // 环境光
    _ambientlight = new THREE.AmbientLight(0xc2c2c2);
    _scene.add(_ambientlight);
    // 方向光
    _directionalLight = new THREE.DirectionalLight(0x808080);
    _directionalLight.position.set(-1, 1, 0);
    _scene.add(_directionalLight);

    setLightingScheme(0);
}

function _initGrid() {
    _gridHelper = new THREE.GridHelper(1000, 100);
    _scene.add( _gridHelper );
    _gridHelper.visible = false;
}

function _initUtil() {
}

function _createScene() {
    _scene = new THREE.Scene();
    var fov = 45,                 //拍摄距离  视野角值越大，场景中的物体越小0-180
        near = 0.5,                 //相机离视体积最近的距离
        far = 5000,            //相机离视体积最远的距离
        aspect = realWidth / realHeight;  //纵横比
    _mainCamera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    _scene.add(_mainCamera);

    _initLights();           //灯光

    _initGrid();          //辅助网格
    _initStats();

    _backgroundScene = new THREE.Scene();
    _backgroundCamera = new THREE.OrthographicCamera(-realWidth / 2, realWidth / 2, realHeight / 2, -realHeight / 2, -1000, 1000);
    _backgroundCamera.position.z = 50;
    _backgroundScene.add(_backgroundCamera);
    //_initBackground(backimgUrl);     //背景

    _initComposer();
}

function _initStats() {
    _stats = new Stats();
    _stats.domElement.style.position = 'absolute';
    _stats.domElement.style.top = '0px';
    //_webContainer.appendChild(_stats.domElement);
}

function _initBackground(url) {
    if (_backgroundScene && _backgroundMesh) {
        _backgroundScene.remove(_backgroundMesh);
    }

    var texture = _textureLoader.load(url);
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        depthTest: false
    });
    _backgroundMesh = new THREE.Mesh(new THREE.PlaneGeometry(2000, 2000), material);
    _backgroundMesh.position.z = -100;
    _backgroundScene.add(_backgroundMesh);
}

function _initComposer() {
    var backgroundPass = new THREE.RenderPass(_backgroundScene, _backgroundCamera);
    var objectPass = new THREE.RenderPass(_scene, _mainCamera);
    objectPass.clear = false;

    var parameters = {
        minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat, stencilBuffer: false
    };             // CHANGED
    var renderTarget = new THREE.WebGLRenderTarget(realWidth, realHeight, parameters);   // CHANGED

    _composer = new THREE.EffectComposer(_renderer, renderTarget);
    _composer.addPass(backgroundPass);
    _composer.addPass(objectPass);

    //var fxaa = new THREE.ShaderPass(THREE.FXAAShader);
    //fxaa.uniforms['resolution'].value = new THREE.Vector2( 1/realWidth, 1/realHeight );
    //_composer.addPass(fxaa);

    //var effectFilm = new THREE.FilmPass(0.8, 0.325, 256, false);
    //effectFilm.renderToScreen = true;
    //_composer.addPass(effectFilm);

    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    effectCopy.renderToScreen = true;
    _composer.addPass(effectCopy);
}

function _trackballControls( $controller ) {
    if (_controller) {
        _controller.removeEventListener('change', _onTrackballControlChanged);
        _controller.dispose();
        _controller = null;
    }

    //会使用$controller这行，请给我说一声---小七
    //_controller = new THREE.OrbitControls(_mainCamera, $controller);
    _controller = new THREE.OrbitControls( _mainCamera );
    _controller.addEventListener('change', _onTrackballControlChanged ); // call this only in static scenes (i.e., if there is no animation loop)
    _controller.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    _controller.dampingFactor = 0.5;
    _controller.screenSpacePanning = false;
    _controller.minDistance = 0.5;
    _controller.maxDistance = 999999;
    _controller.maxPolarAngle = Math.PI;
    _controller.minPolarAngle = 0;
    _controller.rotateSpeed = 0.4;

    //_controller = new THREE.TrackballControls(_mainCamera);
    //_controller.rotateSpeed = 5.0;
    //_controller.zoomSpeed = 3;
    //_controller.panSpeed = 2;
    //_controller.noZoom = false;
    //_controller.noPan = true;
    //_controller.staticMoving = true;
    //_controller.dynamicDampingFactor = 0.3;
    //_controller.addEventListener('change', _onTrackballControlChanged);

    _controller.target = new THREE.Vector3(0, 0, 0);
}

function _callHotSpotScreenPosCallback(id) {
    if (_hotSpots.hasOwnProperty(id)) {
        var modelPos = _exhibitModel.position.clone();
        var worldPos = modelPos.add(_hotSpots[id].hotSpotNode.position);
        var screenPos = _worldPosToScreenPos(worldPos);

        var cameraPos = _mainCamera.position.clone();
        var center = _controller.target.clone();

        var line = new THREE.Line3(cameraPos, center);
        var target = new THREE.Vector3();
        line.closestPointToPoint(worldPos, false, target);
        var trans = 1;
        if (target != null) {
            if (target.distanceTo(cameraPos) < center.distanceTo(cameraPos)) {
                trans = 1;
            }
            else {
                trans = 1 - target.distanceTo(center) / worldPos.distanceTo(center);
            }
        }

        if (!trans) {
            trans = 1;
        }

        if (_hotSpotScreenCallback && screenPos) {
            _hotSpotScreenCallback(id, screenPos.x, screenPos.y, trans);
            //console.log(trans);
        }
    }
}

function _onTrackballControlChanged() {
    _callAllHotSpotScreenPosCallback();
    _callCameraStatusCallback();
    _updateRulerResultPos();
}

function _callAllHotSpotScreenPosCallback() {
    for (var id in _hotSpots) {
        _callHotSpotScreenPosCallback(id);
    }
}

function _hotSpotTransformChanged(event) {
    if (_hotSpotEditingCallback) {
        _hotSpotEditingCallback(event.target.hotSpotId, event.target.position.x, event.target.position.y, event.target.position.z);
    }
    _callHotSpotScreenPosCallback(event.target.hotSpotId);
}

function _updateHotSpotsControllers() {
    if (_exhibitModel) {
        for (var id in _hotSpots) {
            _hotSpots[id].control.update();
        }
    }
}

//function _cameraTargetControlChanged() {
//    if (_controller) {
//        _controller.target = _cameraTarget.position;
//    }
//}

function _onWindowResize() {
    _updateRealSize();

    _renderer.setSize(realWidth, realHeight);
    _composer.setSize(realHeight, realHeight);

    _mainCamera.aspect = realWidth / realHeight;
    _mainCamera.updateProjectionMatrix();

    _backgroundCamera.left = -realWidth / 2;
    _backgroundCamera.right = realWidth / 2;
    _backgroundCamera.top = realHeight / 2;
    _backgroundCamera.bottom = -realHeight / 2;
    _backgroundCamera.updateProjectionMatrix();

    //if (_controller) {
    //    _controller.handleResize();
    //}
}

function _updateFrame() {
    if (_controller) {
        _controller.update();
    }

    if (_cameraTargetControl) {
        _cameraTargetControl.update();
    }

    if (_clippingPlaneControl1) {
        _clippingPlaneControl1.update();
    }

    if (_clippingPlaneControl2) {
        _clippingPlaneControl2.update();
    }

    _updateHotSpotsControllers();

    _stats.update();

    requestAnimationFrame(_updateFrame);

    //_composer.render();
    _renderer.render(_backgroundScene, _backgroundCamera);
    _renderer.autoClear = false;
    _renderer.render(_scene, _mainCamera);
    _renderer.autoClear = true;

    if (_dirtyCameraResetFlag) {
        _dirtyCameraResetFlag = false;
        _onTrackballControlChanged();
    }
}

// 热点相关

// 环境光颜色
// 方向光方向 x,z,y
// 方向光颜色
//1.上斜光
function _lightingScheme0() {
    _ambientlight.color.set(0xc2c2c2);
    _directionalLight.position.set(0, 0, 1 );
    _directionalLight.color.set(0x808080);

    _currentLightingScheme = 1;
}
//2.下斜光
function _lightingScheme1() {
    _ambientlight.color.set(0xc2c2c2);
    _directionalLight.position.set(0, 0, -1 );
    _directionalLight.color.set(0x808080);

    _currentLightingScheme = 1;
}
//3.顶光
function _lightingScheme2() {
    _ambientlight.color.set(0xA1A1A1);
    _directionalLight.position.set(0, 1, 0 );
    _directionalLight.color.set(0x808080);

    _currentLightingScheme = 1;
}
//4.底光
function _lightingScheme3() {
    _ambientlight.color.set(0xA1A1A1);
    _directionalLight.position.set(0, -1, 0 );
    _directionalLight.color.set(0x808080);

    _currentLightingScheme = 1;
}

function _worldPosToScreenPos( worldPos ) {
    var pos = worldPos.clone();
    var projector = new THREE.Projector();

    var vector = pos.project(_mainCamera);

    var halfWidth = window.innerWidth / 2;
    var halfHeight = window.innerHeight / 2;

    var screenPos = new THREE.Vector2(Math.round(vector.x * halfWidth + halfWidth), Math.round(-vector.y * halfHeight + halfHeight));

    return screenPos;
}