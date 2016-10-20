/**
 * 页面头部header
 */
let DeliveryHeader = React.createClass({
    backClick(){
        this.context.router.goBack();
    },
    render(){
        return <div className="innerHeader">
            <div className="back" onClick={this.backClick}>
                <div><span className="secoo_icon_back"></span></div>
            </div>
            <div className="content"><div>配送方式</div></div>
            <div className="more"></div>
        </div>
    }
});
class SettlementImgList extends React.Component {
    render() {
        let items=[],datas = this.props.cartItems;
        for(var key in datas){
            items.push(<img src={datas[key].image} />);
        }
        return (
            <div className='img_box clell_border'>
                <div className='float_div'></div>
                <div className='cell img_list'>
                    {items}
                </div>
            </div>
        );
    }
}
// 主体内容
let DeliveryMain = React.createClass({
    getInitialState(){
        return this.props.data;
    },
    deliverySelect(deliverTypeTempls,deliverType,event){
        let target = event.target;
        if(target.value == "") return;
        for(let i = 0; i < deliverTypeTempls.length; i++){
            if(deliverTypeTempls[i].deliverType != deliverType){
                deliverTypeTempls[i].isChoose = false;
            }else{
                deliverTypeTempls[i].isChoose = true;

                // select
                let pickUpList = deliverTypeTempls[i].pickUpList;
                if(pickUpList){
                    for(let j = 0; j < pickUpList.length; j++){
                        if(pickUpList[j].vendorWarehouseId == target.value){
                            pickUpList[j].isChoose = true;
                        }else{
                            pickUpList[j].isChoose = false;
                        }
                    }
                }
            }
        }
        this.setState(this.state);
    },
    render(){
        let state = this.state,
            chooseDeliverTypes = state.chooseDeliverTypes;
        for(let i = 0; i < chooseDeliverTypes.length; i++){
            let cartItems = chooseDeliverTypes[i].cartItems,
            proList = [],deliverySub = [],detailsAry = [],remind = "";
            proList.push(
                <SettlementImgList cartItems={cartItems}/>
            );
            let deliverTypeTempls = chooseDeliverTypes[i].deliverTypeTempls;
            for(let j = 0; j < deliverTypeTempls.length; j++){
                let deliveryIsChoose = deliverTypeTempls[j].isChoose,
                    subClass = deliveryIsChoose?"selected":"";
                if(deliverTypeTempls[j].deliverType == 0){
                    let picUpAry = [],
                        pickUpList = deliverTypeTempls[j].pickUpList;
                    if(!deliveryIsChoose){
                        picUpAry.push(<option selected="selected" value="">请选择</option>);
                    }
                    for(var k = 0; k < pickUpList.length; k++){
                        picUpAry.push(
                            <option selected={pickUpList[k].isChoose && deliveryIsChoose?"selected":false} value={pickUpList[k].vendorWarehouseId}>{pickUpList[k].name}</option>
                        );
                        if(deliveryIsChoose) {
                            if (pickUpList[k].isChoose) {
                                let details = pickUpList[k].details;
                                for (let c = 0; c < details.length; c++) {
                                    detailsAry.push(
                                        <li>
                                            <div>{details[c].name}</div>
                                            <span>{details[c].value}</span></li>
                                    );
                                }
                                remind = deliverTypeTempls[j].remind;
                            }
                        }
                    }
                    deliverySub.push(
                        <li className={subClass}>
                            <span>{deliverTypeTempls[j].name}</span>
                            <select onChange={this.deliverySelect.bind(this,deliverTypeTempls,deliverTypeTempls[j].deliverType)}>{picUpAry}</select>
                        </li>
                    );

                }else{
                    deliverySub.push(
                        <li className={subClass} onClick={this.deliverySelect.bind(this,deliverTypeTempls,deliverTypeTempls[j].deliverType)}>
                            <span>{deliverTypeTempls[j].name}</span>
                        </li>
                    );
                }
            }
            return <div className="mt20 song-item">
                {proList}
                <div className="select-section mixin-border">
                    <div className="bold select-title">可选配送方式</div>
                    <div className="select-ls">
                        <ul>
                            {deliverySub}
                        </ul>
                    </div>
                    {detailsAry.length?<div className="select-detail mixin-border">
                        <ul>{detailsAry}</ul>
                    </div>:""}
                </div>
                {remind?<div className="cell mixin-border tips red"><div>{remind}</div></div>:""}
            </div>;
        }
    }
});

// 确认的按钮
let DeliveryConfirm = React.createClass({
    confirmClick(){
        console.log(this.props.data);
    },
    render(){
        return <div className="page-btn-wrap" onClick={this.confirmClick}>
            <a href="javascript:;" className="secoo_btn secoo_btn_default">确定</a>
        </div>;
    }
});
// 商品详情列表
class SettlementProList extends React.Component{
    constructor(props) {
        super(props);
        this.state = this.props.data;
    }
    backClick(){
        this.context.router.goBack();
    }
    render(){
        let state = this.state,proItemAry = [],presentItemAry = [];
        let commonCartItems = state.commonCartItems || [],
            presentCartItems = state.presentCartItems || [];
        for(let i = 0; i < commonCartItems.length; i++){
            proItemAry.push(
                <div className={(i == 0?"":" clell_border")+"pro-detail-item"}>
                    <div className="pro-info-first">
                        <div className="info-icon"><img src={commonCartItems[i].image}/></div>
                        <div className="info-box">
                            <div>
                                <div className="info-title">{commonCartItems[i].name}</div>
                                <div className="info-mixin">数量:x{commonCartItems[i].quantity}&nbsp;{commonCartItems[i].spec}</div>
                            </div>
                            <div className="info-wrap">
                                {commonCartItems[i].isSpecificForUserDiscount?<div className="info-special">特殊商品<span className="secoo_icon_Artboard-3"></span></div>:""}
                                <div className="info-amount">￥{commonCartItems[i].nowPrice}</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        for(let j = 0; j < presentCartItems.length; j++){
            presentItemAry.push(
                <div className="pro-info-second">
                    <div className="info-gift">[赠品] {presentCartItems[j].name}</div>
                    <div className="info-count">x{presentCartItems[j].quantity}</div>
                </div>
            );
        }
        return <div className="page-view selected">
            <header className="header">
                <div className="back" onClick={this.backClick}>
                    <div><span className="secoo_icon_back"></span></div>
                </div>
                <div className="content"><div>结算中心</div></div>
                <div className="more"></div>
            </header>
            <div className="pro-detail-list mt20 page-content">
                {proItemAry}
                {presentItemAry.length?<div className="pro-gift-list clell_border">{presentItemAry}</div>:""}
            </div>
        </div>;
    }
}
var pageEle = document.getElementById("delivery-page-view");
// 初始化header
ReactDOM.render(
    <DeliveryHeader/>,
    pageEle.getElementsByTagName("header").item(0));
// 主体内容
ReactDOM.render(
    <DeliveryMain data={confirmJson.deliverType} />,
    pageEle.getElementsByClassName('page-content').item(0));
// 确认按钮
ReactDOM.render(
    <DeliveryConfirm  data={confirmJson.deliverType}/>,
    pageEle.getElementsByClassName('footer-btn-panel').item(0));

// ReactDOM.render(
//     <SettlementProList data={confirmJson.cart.cartItems}/>,pageEle);
