/**
 * 激活优惠券组件
 */
let InputPops = React.createClass({
    componentDidMount:function (){
        this.refs.ticketInput.focus();
    },
    closeClick:function(){
        document.getElementById("ticket-pops").innerHTML = "";
    },
    disClick:function(event){
        event.stopPropagation();
        event.preventDefault();
    },
    confirmClick:function(){
        console.log(this.refs.ticketInput.value);
    },
    ticketChange:function(event){
        this.refs.confirmBtn.classList.toggle("disabled",event.target.value == "");
    },
    render: function(){
        return <div className="input-pops selected" onClick={this.closeClick}>
            <div className="input-pops-item ticket-input selected" onClick={this.disClick}>
                <div className="title-line">
                    <div onClick={this.closeClick} className="left-area secoo_icon_guanbi"></div>激活优惠券
                </div>
                <input className="mixin-input mt20" onChange={this.ticketChange} type="text" ref="ticketInput" placeholder="请输入优惠码"/>
                <a href="javascript:;" ref="confirmBtn" onClick={this.confirmClick} className="secoo_btn secoo_btn_default disabled">确定</a>
            </div>
        </div>;
    }
});
/**
 * 页面头部header
 */
let InnerHeader = React.createClass({
    activeClick:function(){
        // 激活优惠券
        ReactDOM.render(
            <InputPops/>,
            document.getElementById("ticket-pops"));
    },
    backClick:function(){
        console.log(event);
    },
    render:function(){
        return <div className="innerHeader">
            <div className="back" onClick={this.backClick}>
                <div><span className="secoo_icon_back"></span></div>
            </div>
            <div className="content"><div>优惠券</div></div>
            <div className="more" onClick={this.activeClick}>
                <div><span>激活</span></div>
            </div>
        </div>
    }
});
/**
 * 优惠券元素
 */
var TicketItem = React.createClass({
    selectClick:function(ticketId){
        this.props.selectItems && this.props.selectItems(ticketId);
    },
    render:function() {
        let btnHtml="",selectClass = this.props.data.isChoose?'secoo_icon_xuanzhong_red':'secoo_icon_weixuan';
        let desc,isUrgent,data = this.props.data;
        if(this.props.listType == 0){
            btnHtml = <span className='secoo_icon_weixuan'></span>;
            desc = data.canotUseDesc;
        }else{
            // 不使用优惠券
            if(data.ticketId == -1){
                return <li onClick={this.selectClick.bind(this,data.ticketId)} className="cell mt20 ticket-item">
                    <div>不使用优惠券</div>
                <span className={selectClass}>
                    <span className="path1"></span>
                    <span className="path2"></span>
                </span>
                </li>;
            }
            btnHtml = <span className={selectClass}><span className='path1'></span><span className='path2'></span></span>;
            isUrgent = data.isUrgent;
            desc = data.useDateDesc;
        }
        let descHtml = <em className={isUrgent?"red":""}>{desc}</em>;
        return <li onClick={this.selectClick.bind(this,data.ticketId)} className='ticket-item'>
            <div className='ticket-amount'><div><span className="yen-show">&yen;</span>{data.amount}</div></div>
            <div className='ticket-box'>
                <div className='ticket-info'>
                    <div>{data.name}</div>
                    <span>{data.desc}</span>
                    {descHtml}
                </div>
                {btnHtml}
            </div>
        </li>;
    }
});
/**
 * 优惠券列表
 */
var TicketList = React.createClass({
    getInitialState:function(){
        return this.props.data;
    },
    selectItems:function(ticketId){
        let data = this.state,
            canUseTicketList = data.canUseTicketList;
        for(let i = 0; i < canUseTicketList.length; i++){
            if(canUseTicketList[i].ticketId == ticketId){
                canUseTicketList[i].isChoose = true;
            }else{
                canUseTicketList[i].isChoose = false;
            }
        }
        this.setState(this.props.data);
        console.log(this.getSelectData());// 使用优惠券
    },
    getSelectData:function(){
        let data = this.state,
            canUseTicketList = data.canUseTicketList;
        for(let i = 0; i < canUseTicketList.length; i++){
            if(canUseTicketList[i].isChoose){
                return canUseTicketList[i];
            }
        }
    },
    render:function() {
        let ticketList = [],ableTicket = [],unableTicket = [];
        let data = this.state,
            canUseTicketList = data.canUseTicketList,
            canotUseTicketList = data.canotUseTicketList;
        // 可用优惠券数据
        for(let i = 0; i < canUseTicketList.length; i++){
            ableTicket.push(
                <TicketItem listType="1" data={canUseTicketList[i]} selectItems={this.selectItems}/>
            );
        }
        // 可用优惠券
        ticketList.push(
            <div className='ticket-list able-ticket-list'>
                <ul>{ableTicket}</ul>
            </div>
        );
        // 不可用优惠券数据
        for(let j = 0; j < canotUseTicketList.length; j++){
            unableTicket.push(
                <TicketItem listType="0" data={canotUseTicketList[j]}/>
            );
        }
        // 不可用优惠券
        ticketList.push(<div className="unable-ticket-tips">
            <div>不可用优惠券</div>
            {data.canotUseTicketDesc?<span>({data.canotUseTicketDesc})</span>:""}
        </div>);
        ticketList.push(
            <div className='ticket-list unable-ticket-list'>
                <ul>{unableTicket}</ul>
            </div>
        );
        // 没有优惠券
        if(!canUseTicketList.length && !canotUseTicketList.length){
            ticketList = <div className="ticket-section">
                <div className="no-ticket">
                    <div><img src="http://mpic.secooimg.com/images/2016/10/11/wuyouhuiquan@3x.png"/></div>
                    <span>您还没有优惠券</span>
                </div>
            </div>;
        }
        return <div className="ticket-section">{ticketList}</div>;
    }
});
var pageEle = document.getElementById("ticket-page-view");
// 初始化header
ReactDOM.render(
    <InnerHeader/>,
    pageEle.getElementsByTagName("header").item(0));
// 初始化优惠券列表
ReactDOM.render(
    <TicketList data={confirmJson.ticket} />,
    pageEle.getElementsByClassName('page-content').item(0));
