import React, { Component } from "react";
import truffleContract from "truffle-contract";


class Shopper extends React.Component {
constructor(props) {
    super(props);

    this.state = {pList:[], storeNum:'',productN:'', productP:'', productQ:'', web3: this.props.web3, accounts: this.props.accounts, contract: this.props.contract };
    }


    componentDidMount = async () => {
        try {
            this.start();
            this.handleChange = this.handleChange.bind(this);
          } catch (error) {
            alert("Error: " + error);
          }
      };

  start = async () => {
    const { accounts, contract, web3 } = this.state;
    var plist=[];

    const _StoreFrontIds = await contract.getStoreFrontCount.call({ from: accounts[0] });

    for (let i=0; i< _StoreFrontIds; i++) {

      const storeFront = await contract.getStoreFrontInfo(i, { from: accounts[0] });
      if(storeFront[5]){
        if(storeFront[2] != "0x0000000000000000000000000000000000000000"){
          plist.push(storeFront[3])
        }
      }
    }
   
    this.setState({pList: []});
  };



  handleChange(event) { this.setState({ [event.target.name]: event.target.value }); }

  
  buy(event) { 
    event.preventDefault();
    const { accounts, contract } = this.state;	
    
      contract.purchaseProduct(this.storeNum,this.productN, {from: accounts[0], value: this.productP})
     
     this.setState({ storeNum:'', productN:'', productP:'', productQ:''});
    
  }
  
  render() {
  
    var p = this.state.pList;
  
    return (
    <form >
    <div>
      <h3> Loged as Shopper</h3> 
    </div>
    <div >
      <h2>buy product</h2>
      <li><input type="text" ref="shopperInput" name="productN" value={this.state.productN} onChange={this.handleChange} placeholder="product number"/></li>
      <li><input type="text" ref="shopperInput4" name="storeNum" value={this.state.storeNum} onChange={this.handleChange} placeholder="store number"/></li>
      
      <li><input type="text" ref="shopperInput2" name="productP" value={this.state.productP} onChange={this.handleChange} placeholder="product price"/></li>
      
      <li><input type="text" ref="shopperInput3" name="productQ" value={this.state.productQ} onChange={this.handleChange} placeholder="product quantity"/></li>
      <li><button onClick={this.buy.bind(this)}>Buy</button></li>
      <br/>
    </div>
   
    <br/>
      <div>
      <h5>List of  Products:
          {p.map(function(plist, index){
           return <li key={ index }>{plist}</li>;
           })}
    </h5>
    </div>
    </form>	
      );
    }
  }
export default Shopper;
