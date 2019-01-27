import React, { Component } from "react";

class StoreOwner extends React.Component {

constructor(props) {
  super(props);
  this.state = {pageone: true, pagetwo: false, pendingStores: [], approvedStores:[], activeStores:[], balance:'', CreateStoreFront: '', accounts: this.props.accounts, contract: this.props.contract, web3: this.props.web3};
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
    const { accounts, contract } = this.state;
    let pendingStores = [];
    let approvedStores = [];
    let activeStores = [];
    let balance = 0;
    try {
    const storeFrontList = await contract.getStoreFrontByStoreOwner.call({ from: accounts[0] });

    //console.log('This is the result ', storeFrontList);
    //alert(storeFrontList)
    for (let storenum of storeFrontList) {
      const storeFront = await contract.getStoreFrontInfo(storenum, { from: accounts[0] });
      if(!storeFront[5]){
        activeStores.push(storenum);
        if(storeFront[2] != "0x0000000000000000000000000000000000000000"){
          approvedStores.push(storenum);
          balance += storeFront[4];
        }else{
          pendingStores.push("Store Number: "+storenum+" , Store Name: "+storeFront[0]);
        }	
      }
    }
  } catch (error) {
    alert("Error: " + error);
  }
    this.setState({pendingStores: pendingStores, approvedStores: approvedStores, activeStores: activeStores, balance: balance });
  };

handleChange = event => {  this.setState({  [event.target.id]: event.target.value });}

CreateStoreFront(event){
  event.preventDefault();
  const { accounts, contract , web3} = this.state;	
  var value = this.state.CreateStoreFront;
  if(!value) {
    alert("Please enter a store name");
 } else{
  //alert(value);
  let storeNameBytes = web3.utils.utf8ToHex(value);
   contract.createStoreFront(value, {from : accounts[0]}).then(result => { 
    //alert("r "+result);
     this.start();
     this.forceUpdate(); 
   });
   this.setState({CreateStoreFront: ''});
  }
}

ManageStore(event){
  event.preventDefault();
  const { accounts, contract } = this.state;	
  var value = this.state.ManageStore;
  if(!value) {
    alert("Please enter a store number");
 } else{
   this.setState({ManageStore: '', pageone: false, pagetwo: true});
  }
}

render() {
  var numActiveStores =  this.state.activeStores.length;
  var numApprovedStores =  this.state.approvedStores.length;
  var numPendingStores =  this.state.pendingStores.length;
  
  return ( 	
    <form>
    <div>
      <h3> Loged as Store Owner</h3> 
      <h4>Active stores = {numActiveStores} | Approved Stores = {numApprovedStores} | Pendding Sotres = {numPendingStores} | Total Balance = {String(this.state.balance)}</h4>
    </div>
    <div >
      <h2>Create a New Store Front</h2>
      <li><input type="text" ref="admininput" id="CreateStoreFront" value={this.state.CreateStoreFront} onChange={this.handleChange} placeholder="Store Name"/></li>
      <li><button onClick={this.CreateStoreFront.bind(this)}>Add</button></li>
      <br/>
    </div>
    <div>
      <h2>Mange a Store Front</h2>
      <li><input type="text" ref="admininput2" id="ManageStore" value={this.state.ManageStore} onChange={this.handleChange} placeholder="Store Number"/></li>
      <li><button onClick={this.ManageStore.bind(this)}>ManageStore</button> </li>
    </div>
    <br/>
    </form>	
      );
    }
  }
export default StoreOwner;
