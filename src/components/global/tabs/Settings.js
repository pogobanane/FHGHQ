// /Settings tab will be here
import React from 'react';
import { connect } from 'react-redux';
import store from '../../../redux/store';
import U from '../useful_functions';
import A from '../../../redux/actions';
import socket from '../../../_static/socket';

class Settings_ extends React.Component {
  handleChangeRoomName(e) {
    const name = e.target.value;
    if (name.length < 33) {
      store.dispatch(A.changeSettings('name', name));
      socket.emit('changeSettings', 'name', name);
    }
  }

  handleChangePassword(e) {
    const password = e.target.value;
    if (password.length < 33) {
      store.dispatch(A.changeSettings('password', password));
      socket.emit('changeSettings', 'password', password);
    }
  }

  DisconnectDiscord() {
    store.dispatch(A.deleteSettings('link'));
    socket.emit('deleteSettings', 'link');
  }

  ResetMap() {
    store.dispatch(A.clearMap());
    socket.emit('clearMap');
  }

  render() {
    // console.log(this.props)
    const management = this.props.users
      .sort(U.compare)
      .map((user) => (
        <ManagementlistUnit
          key={user.id}
          HandleRankChange={this.HandleRankChange}
          user={user}
          myrank={this.props.myrank}
        />
      ));

    return (
      <div id='manage' className='container tab-pane row'>
        <div className='row'>
          <div className='col' id='settings_usertable_col'>
            <h4>Manage users</h4>
            <table className='table' id='settings_usertable'>
              <colgroup>
                <col width='200' />
                <col width='140' />
                <col width='120' />
              </colgroup>
              <thead className='indextable'>
                <tr>
                  <th>
                    <h5>Username</h5>
                  </th>
                  <th>
                    <h5>Rank</h5>
                  </th>
                  <th>
                    <h5>Change rank</h5>
                  </th>
                </tr>
              </thead>
              <tbody id='managetablebody'>{management}</tbody>
            </table>
          </div>
          <div className='col'>
            <h4>Room settings</h4>
            <table>
              <tbody>
                <tr>
                  <td className='settings_td1'>
                    <h5>Room name:</h5>
                  </td>
                  <td className='settings_td2'>
                    <input
                      type='text'
                      value={this.props.settings.name}
                      onChange={this.handleChangeRoomName}
                    />
                  </td>
                </tr>
                <tr>
                  <td className='settings_td1'>
                    <h5>Password:</h5>
                  </td>
                  <td className='settings_td2'>
                    {' '}
                    <input
                      type='text'
                      value={this.props.settings.password}
                      disabled={this.props.settings.secure == 1}
                      onChange={this.handleChangePassword}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div className='form-check-inline'>
              <label className='form-check-label'>
                <h5>
                  <input
                    type='radio'
                    className='form-check-input'
                    name='faction'
                    value='1'
                    checked={this.props.settings.secure == 1}
                    onChange={() =>
                      window.modalcontainer.ShowModal(3, 'secure')
                    }
                  />
                  Secure
                </h5>
              </label>
            </div>
            <div className='form-check-inline'>
              <label className='form-check-label'>
                <h5>
                  <input
                    type='radio'
                    className='form-check-input'
                    name='faction'
                    value='0'
                    checked={this.props.settings.secure == 0}
                    onChange={() =>
                      window.modalcontainer.ShowModal(3, 'unsecure')
                    }
                  />
                  Unsecure
                </h5>
              </label>
            </div>
            <button
              className='btn'
              onClick={() => window.modalcontainer.ShowModal(4)}
            >
              Reset Room
            </button>
            <button className='btn' onClick={() => this.ResetMap()}>
              Reset Map
            </button>
          </div>
        </div>
      </div>
    );
  }
}

class ManagementlistUnit extends React.Component {
  constructor(props) {
    super(props);
    this.HandleRankChange = this.HandleRankChange.bind(this);
    this.ChangeSelect = this.ChangeSelect.bind(this);
  }

  ChangeSelect(e) {
    this.HandleRankChange(e.target.value);
  }

  HandleRankChange(rank) {
    if (rank == 1) {
      window.modalcontainer.ShowModal(0, this.props.user);
    } else {
      store.dispatch(A.setUser({ id: this.props.user.id, rank }));
    }
  }

  render() {
    const canAccept = !(
      this.props.myrank >= this.props.user.rank ||
      window.steamid == this.props.user.id ||
      this.props.user.rank > 4
    );
    const selection = [];
    let { avatar } = this.props.user;
    if (this.props.user.id.includes('anonymous')) {
      avatar =
        'https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2Fdasd.jpg?1556805827222';
    }
    for (let i = 1; i < 5; i++) {
      if (this.props.myrank == 1 || this.props.myrank < i) {
        selection.push(
          <option key={i} value={i}>
            {window.Ranks[i]}
          </option>
        );
      }
    }

    return (
      <tr>
        <td className='textleft'>
          <h6 className='userlist_header'>
            <img className='profileimg' src={avatar} />
            <a
              href={`https://steamcommunity.com/profiles/${this.props.user.id}`}
              target='_blank'
            >{` ${this.props.user.name}`}</a>
          </h6>
        </td>
        <td>
          <p>{window.Ranks[this.props.user.rank]}</p>
        </td>
        <td>
          {canAccept && (
            <select
              value={this.props.user.rank}
              onChange={this.ChangeSelect}
              name='rank'
            >
              {selection}
            </select>
          )}
          {this.props.user.rank == 5 && (
            <div>
              <p>Approve</p>
              <button
                className='approvebtn'
                onClick={() => this.HandleRankChange(3)}
              >
                //accept
                <img
                  className='approve_img'
                  src='https://cdn.glitch.com/6393f3fd-16a7-4641-ae3d-994f8e7cea4e%2Fcheckmark.png?1546938883091'
                />
              </button>
              <button
                className='approvebtn'
                onClick={() => this.HandleRankChange(4)}
              >
                //decline
                <img
                  className='approve_img'
                  src='https://cdn.glitch.com/6393f3fd-16a7-4641-ae3d-994f8e7cea4e%2FX%20icon%20small.png?1546753641488'
                />
              </button>
            </div>
          )}
        </td>
      </tr>
    );
  }
}

const mapStateToProps = (store) => {
  // console.log(store)
  const { meta } = store;
  return {
    users: store.users.users,
    myrank: store.users.myrank,
    settings: meta.settings,
  };
};
export const Settings = connect(mapStateToProps)(Settings_);
