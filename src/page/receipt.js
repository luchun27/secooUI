/**
 * 页面头部header
 */
let ReceiptHeader = React.createClass({
    rightClick:function(){
        // 发票须知
        ReactDOM.render(
            <ReceiptTips/>,
            document.getElementById("ticket-pops"));
    },
    backClick:function(){
        this.context.router.goBack();
    },
    render:function(){
        return <div className="innerHeader">
            <div className="back" onClick={this.backClick}>
                <div><span className="secoo_icon_back"></span></div>
            </div>
            <div className="content"><div>发票</div></div>
            <div className="more"></div>
            <div className="moreText" onClick={this.rightClick}>发票须知</div>
        </div>
    }
});
/**
 * 发票须知
 */
let ReceiptTips = React.createClass({
    closeClick:function(){
        document.getElementById("ticket-pops").innerHTML = "";
    },
    disClick:function(event){
        event.stopPropagation();
        event.preventDefault();
    },
    render: function(){
        return <div className="mixin-pops selected" onClick={this.closeClick}>
                <div className="mixin-pops-item receipt-pops selected" onClick={this.disClick}>
                    <div className="receipt-tips">
                        <div>1、订单状态变为已完成，并且无退货情况下，会为您补寄发票。</div>
                        <div>2、开票金额不包括优惠券、服务费、促销返利、库币支付的部分。</div>
                    </div>
                    <div className="mixin-border pops-confirm-btn" onClick={this.closeClick}>确定</div>
                </div>
            </div>;
    }
});
// 发票选择项
let ReceiptItem = React.createClass({
    selectClick:function(invoicetype){
        this.props.selectItems(invoicetype);
    },
    render:function() {
        let data = this.props.data,
            selectClass = data.isChoose?'secoo_icon_xuanzhong':'secoo_icon_weixuan',
            borderClass = data.invoiceType == -1? "receipt-item cell":"receipt-item cell clell_border";
        return <div className={borderClass} onClick={this.selectClick.bind(this,data.invoiceType)}>
            <div className="">{data.name}</div>
                <span className={selectClass}>
                    <span className="path1"></span>
                    <span className="path2"></span>
                </span>
            </div>;
    }
});
// 发票主体
let ReceiptMain = React.createClass({
    getInitialState:function(){
        return this.props.data;
    },
    selectItems:function(invoiceType){
        let data = this.state,
            invoiceTypeList = data.invoiceTypeList;
        for(let i = 0; i < invoiceTypeList.length; i++){
            if(invoiceTypeList[i].invoiceType == invoiceType){
                invoiceTypeList[i].isChoose = true;
            }else{
                invoiceTypeList[i].isChoose = false;
            }
        }
        this.setState(this.props.data);
    },
    getSelectData:function(){
        let data = this.state,
            invoiceTypeList = data.invoiceTypeList;
        for(let i = 0; i < invoiceTypeList.length; i++){
            if(invoiceTypeList[i].isChoose){
                return invoiceTypeList[i];
            }
        }
    },
    receiptSubmit:function(){ // 提交
        var invoice = this.getSelectData();
        console.log(invoice);
        if(invoice.invoiceType == 1){
            console.log(this.refs.companyInput.value);
        }
    },
    render:function(){
        let data = this.state,
            invoiceTypeList = data.invoiceTypeList,
            receiptItems = [];
        for(let i = 0; i < invoiceTypeList.length;i++){
            let company = invoiceTypeList[i].invoiceType == 1;
            receiptItems.push(
                <ReceiptItem data={invoiceTypeList[i]} selectItems={this.selectItems}/>
            );
            if(company && invoiceTypeList[i].isChoose){
                receiptItems.push(
                    <div className="company-input selected">
                        <input className="mixin-input" defaultValue={invoiceTypeList[i].invoiceTitle} onChange={this.companyChange} ref="companyInput" type="text" placeholder="请输入公司发票抬头"/>
                    </div>
                );
            }
        }
        // 存在海外商品
        let tipsHtml = data.subTitle?<div className="cell tips red" style={{background:'transparent'}}><div>{data.subTitle}</div></div>:undefined;
        return <div className="page-view selected">
                <header className="header"></header>
                <div className="page-content">
                    <div className={tipsHtml?"":"mt20"}>
                        {tipsHtml}
                        {receiptItems}
                        <div className="receipt-page-btn">
                            <a href="javascript:;" onClick={this.receiptSubmit} className="secoo_btn secoo_btn_default">提交</a>
                        </div>
                    </div>
                </div>
            </div>;
    }
});
// 失效商品列表
class InvalideProList extends React.Component{
    constructor(props){
        super(props)
        this.state = {exceptionInventoryList:[{
            "image":"http://pic11.secooimg.com/product/500/500/20/46/15932046.jpg",
            "productId":15932046,
            "quantity":1,
            "name":"GUCCI/古驰女士帆布时尚印花单肩包400249KHNRN9674",
            "status":0
        }]};
    }
    closePops(){
        console.log("关闭");
    }
    render(){
        let proListAry = [],exceptionInventoryList = this.state.exceptionInventoryList;
        for(let i = 0; i < exceptionInventoryList.length; i ++){
            proListAry.push(
                <li>
                    <div className="pro-icon"><img src={exceptionInventoryList[i].image}/></div>
                    <div className="pro-info">
                        <div className="pro-title">{exceptionInventoryList[i].name}</div>
                        <div className="pro-count">数量:<span>x{exceptionInventoryList[i].quantity}</span></div>
                    </div>
                </li>
            );
        }
        return <div className="mixin-pops selected">
            <div className="mixin-pops-item stockOut-list selected">
                <div className="pro-tips">以下商品暂时缺货，无法提交订单</div>
                <div className="pro-list">
                    <ul className={proListAry.length == 3?"more-scroll":""}>
                        {proListAry}
                    </ul>
                </div>
                <div className="mixin-border pops-confirm-btn" onClick={this.closePops}>确定</div>
            </div>
        </div>;
    }
}

var pageEle = document.getElementById("receipt-page-view");
// 初始化发票主体
ReactDOM.render(
    <ReceiptMain data={confirmJson.invoice} />,pageEle);
ReactDOM.render(
    <ReceiptTips/>,
    document.getElementById("ticket-pops"));