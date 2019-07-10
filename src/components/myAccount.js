import React, { Component } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import LoadingOverlay from 'react-loading-overlay';


class MyAcount extends Component {

  state = {
    id: '',
    username: '',
    newpassword: '',
    newpasswordC: '',
    oldpassword: '',
    level: '',
    phone: '',
    address: '',
    email: '',
    panier: [],
    orders: [],
    userAuth: 'basic',
    isLoading: true,
    isActive: false,
    isGoogleAuth: false
  }

  componentDidMount = async () => {
    await this.getSession()
    if (this.state.userAuth === 'manager' || this.state.userAuth === 'client') {
      this.getAccount()
      this.setState({ isLoading: false })
      console.log('<Myaccount> isAuth : ' + this.state.userAuth)
    }
    else {
      this.setState({ userAuth: 'basic' })
      console.log('<CatalogueGestion> isAuth : ' + this.state.userAuth)
      this.props.history.push('/Login')
    }
  }

  getSession = async () => {
    let userAuth = await fetch('/users/level', { method: 'get' })
      .then(res => res.text())
    this.setState({ userAuth: userAuth })
  }

  getAccount = async () => {
    let account = []
    await fetch('/users/account/', { method: 'get' }).then(res => res.text()).then(res => account = JSON.parse(res)).catch(err => err)
    this.setState({
      username: account.username, level: account.level, panier: account.panier,
      orders: account.orders, id: account._id,
      address: account.address, phone: account.phone, email: account.email
    })
    if (account.username === account.email) this.setState({ isGoogleAuth: true })
  }


  updateInputValueLevel = (event) => {
    const { value } = event.target
    this.setState({ level: value })
  }
  updateInputValueUsername = (event) => {
    const { value } = event.target
    this.setState({ username: value })
  }

  updateInputValuePhone = (event) => {
    const { value } = event.target
    this.setState({ phone: value })
  }

  updateInputValueAdress = (event) => {
    const { value } = event.target
    this.setState({ address: value })
  }

  updateInputValuePassword = (event) => {
    const { value } = event.target
    this.setState({ newpassword: value })
  }

  updateInputValuePasswordC = (event) => {
    const { value } = event.target
    this.setState({ newpasswordC: value })
  }

  updateInputValueoldpassword = (event) => {
    const { value } = event.target
    this.setState({ oldpassword: value })
  }

  updateInputValueemail = (event) => {
    const { value } = event.target
    this.setState({ email: value })
  }


  handleapplicate = async () => {
    this.setState({ isActive: true })
    let response = []
    await fetch('/users/update', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...this.state })
    })
      .then(res => res.text()).then(res => response = JSON.parse(res)).catch(err => err)
    this.setState({ isActive: false })
    alert(response.message)
  }

  handleChangePassword = async () => {
    if (this.state.newpassword === this.state.newpasswordC) {
      this.setState({ isActive: true })
      let response = []
      await fetch('/users/changepassword', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldpassword: this.state.oldpassword, newpassword: this.state.newpassword, id: this.state.id })
      })
        .then(res => res.text()).then(res => response = JSON.parse(res)).catch(err => err)
      this.setState({ isActive: false, oldpassword: '', newpassword: '', newpasswordC: '' })
      alert(response.message)
    } else {
      alert('not the same password')
    }
  }

  deleteOrder = async (index) => {
    let orders = this.state.orders
    orders.splice(index, 1);
    this.setState({ orders: orders })
  }

  deletePanier = async () => {
    this.setState({ panier: [] })
  }




  render() {
    const { orders, username, level, phone, address, newpassword, newpasswordC, email, oldpassword } = this.state


    if (this.state.isLoading === false && ((level === 'manager') || (level === 'client'))) {
      let user, changepassword = <></>


      let Orders = <></>
      Orders = Object.keys(orders)
        .map(key => <Order key={key} total={orders[key].total} index={key} id={orders[key].order} deleteOrder={this.deleteOrder} />)


      let levelInput = <></>
      if (level === 'manager') {
        levelInput = <div className="row ">
          <div className="col-2">
            <h3 className="input-group-addon text-center text-light">level </h3>
          </div>
          <div className="col-10">
            <input type='text' value={level || ''} name='level' className="form-control" onChange={this.updateInputValueLevel} />
          </div>
        </div>
      }

      if (!this.state.isGoogleAuth) {
        user = <div className="row ">
          <div className="col-2">
            <h3 className="input-group-addon text-center text-light">username </h3>
          </div>
          <div className="col-10">
            <input type='text' value={username || ''} name='username' className="form-control" onChange={this.updateInputValueUsername} />
          </div>
        </div>

        changepassword =
          <div className="row ">
            <div className="col-2">
              <h3 className="input-group-addon text-center text-light"> Change Password  </h3>
            </div>
            <div className="col-10">
              <input type='password' value={oldpassword || ''} placeholder='old password' name='password' className="form-control" onChange={this.updateInputValueoldpassword} />
              <input type='password' value={newpassword || ''} placeholder='new password' name='password' className="form-control" onChange={this.updateInputValuePassword} />
              <input type='password' value={newpasswordC || ''} placeholder='confirm new password' name='password' className="form-control" onChange={this.updateInputValuePasswordC} />
              <button className='btn btn-success ' onClick={this.handleChangePassword} > Change password </button>
            </div>
          </div>
      }

      return (
        <LoadingOverlay
          active={this.state.isActive}
          spinner
          text='Loading your content...'
        >
          <div className=" bg-secondary">

           <br />
            <h1 className="text-center text-light">My account</h1>

            <div className="grey-text">


              {user}
              {levelInput}
              <div className="row ">
                <div className="col-2">
                  <h3 className="input-group-addon text-center text-light"> phone </h3>
                </div>
                <div className="col-10">
                  <input type='text' value={phone || ''} name='phone' className="form-control" onChange={this.updateInputValuePhone} />
                </div>
              </div>

              <div className="row ">
                <div className="col-2">
                  <h3 className="input-group-addon text-center text-light"> address </h3>
                </div>
                <div className="col-10">
                  <input type='text' value={address || ''} name='address' className="form-control" onChange={this.updateInputValueAdress} />
                </div>
              </div>

              <div className="row ">
                <div className="col-2">
                  <h3 className="input-group-addon text-center text-light"> email </h3>
                </div>
                <div className="col-10">
                  <input type='email' value={email || ''} name='email' className="form-control" onChange={this.updateInputValueemail} />
                </div>
              </div>

              <br />

              {changepassword}

              <br />


              <div className="row ">
                <div className="col-2">
                  <h3 className="input-group-addon text-center text-light">Shoping Cart </h3>
                </div>
                <div className="col-10 text-light">
                  count element {this.state.panier.length} <br />
                  <button className='btn btn-success text-center' onClick={this.deletePanier} > Delete Panier </button>
                </div>

              </div>




              <br />


              <div className="row ">
                <div className="col-2">
                  <h3 className="input-group-addon text-center text-light"> my last orders </h3>
                </div>
                <div className="col-10">
                  {Orders} 
                </div>
              </div>

            </div>
            <div className="row ">
              <div className="col-2">
              </div>
              <div className="col-10">
                <button
                  className="btn btn-primary btn-lg btn-block"
                  onClick={() => { this.handleapplicate() }}
                >Save</button>
              </div>
            </div>
            <br /><br />
          </div>






        </LoadingOverlay>
      )
    } else {
      return (
        <div className='text-center'>
          <br /><br /><br /><br /><CircularProgress disableShrink />
        </div>
      )
    }
  };
}



const Order = ({ index, total, deleteOrder }) => {
  return (
    <div className='container border text-light'>
      Order {(parseInt(index) + 1)} <br />
      <strong> Total =>   {total} $ </strong>
      <button className='btn btn-danger ' onClick={() => deleteOrder(index)} > - Delete </button>
      <br />
    </div>
  )
}


export default MyAcount;