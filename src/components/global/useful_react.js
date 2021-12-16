import React from 'react';
import { connect } from 'react-redux';
import A from '../../redux/actions';
import socket from '../../_static/socket';
import store from '../../redux/store';
import U from './useful_functions';

const Popover = require('react-tiny-popover');
// SOCKET EVENTS//////////////////////
socket.on('deleteObject', (packet) => {
  store.dispatch(A.deleteObject(packet.type, packet.key));
});
// //////
socket.on('updatedynmap', (packet) => {
  store.dispatch(A.setDynamic(packet.dynamic, packet.events));
});
socket.on('updatestats', (packet) => {
  store.dispatch(A.setStats(packet));
});
socket.on('updateObject', (packet) => {
  store.dispatch(A.updateObject(packet.type, packet.object, packet.key));
});
// //////
socket.on('updateTech', (packet) => {
  store.dispatch(A.updateTech(packet.techtree));
});
// //////
socket.on('deleteroom', () => {
  window.modalcontainer.ShowModal(1);
});
socket.on('setRole', (user) => {
  store.dispatch(A.setRole(user));
});
socket.on('deleteblueprint', (id) => {
  store.dispatch(A.deleteBlueprint(id));
});
socket.on('submitEvent', (packet) => {
  store.dispatch(
    A.submitEvent({
      type: packet.type,
      date: packet.date,
      packet: packet.packet,
    })
  );
});
socket.on('submitOpTimer', (packet) => {
  store.dispatch(A.submitOpTimer(packet.date));
});
socket.on('toggleSecure', (packet) => {
  store.dispatch(A.toggleSecure(packet));
});
socket.on('clearRoom', () => {
  store.dispatch(A.clearRoom());
});
socket.on('clearMap', () => {
  store.dispatch(A.clearMap());
});
socket.on('changeSettings', (type, data) => {
  store.dispatch(A.changeSettings(type, data));
});
socket.on('deleteSettings', (type) => {
  store.dispatch(A.deleteSettings(type));
});
socket.on('disconnectDiscord', () => {
  store.dispatch(A.disconnectDiscord());
});
socket.on('addMessage', (packet, category) => {
  store.dispatch(A.addMessage(packet, category));
});
socket.on('requestaccess', (user) => {
  // console.log("Requesting access",user)
  user.role = 0;
  store.dispatch(A.requestAccess(user));
});
socket.on('leaveroomroom', (userid) => {
  store.dispatch(A.leaveRoom(userid));
});
// ///////////////////////////////////////////////
function UpdateObject(type, obj, key) {
  store.dispatch(A.updateObject(type, obj, key));
  socket.emit('updateObject', { type, object: obj, key });
}
// ////////////////////////////////////////
class Notes extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.storeObj == undefined && nextProps.storeObj == undefined) {
      return false;
    }
    let obj = this.props.storeObj;
    if (obj == undefined) {
      obj = {};
    }
    const newobj = nextProps.storeObj;
    if (obj.notes == undefined && newobj.notes == undefined) {
      return false;
    }
    if (obj.notes === newobj.notes) {
      return false;
    }
    return true;
  }

  ChangeNotes(event) {
    const obj = JSON.parse(JSON.stringify(this.props.storeObj));
    obj.notes = event.target.value;
    let kind = this.props.selected.type;
    if (this.props.selected.townname == 'misc') {
      kind = `misc_${this.props.selected.type}`;
    }
    store.dispatch(A.updateObject(kind, obj, this.props.selected.key));
    socket.emit('updateObject', {
      type: kind,
      object: obj,
      key: this.props.selected.key,
    });
  }

  render() {
    const obj = this.props.storeObj;
    let classname = 'card-body cardheader collapse show ';
    if (obj.type != undefined) {
      classname += 'misc_notes_height';
    }
    // console.log("Notes obj",obj)
    if (obj == undefined || obj.notes == undefined) {
      return (
        <>
          <div className={classname} id='cardnotes'>
            <textarea
              className='card_notes_input useronly'
              spellCheck='false'
              value=''
              onChange={(event) => this.ChangeNotes(event)}
            />
          </div>
        </>
      );
    }
    return (
      <>
        <div className={classname} id='cardnotes'>
          <textarea
            className='card_notes_input useronly'
            spellCheck='false'
            value={obj.notes}
            onChange={(event) => this.ChangeNotes(event)}
          />
        </div>
      </>
    );
  }
}
// /////////////////////////////////////////////////////////////////////////////////////////
class LastUpdate_ extends React.Component {
  render() {
    if (
      this.props.storeObj == undefined ||
      this.props.storeObj.lastupdate == undefined
    ) {
      return (
        <div
          className='card-header cardheader'
          data-toggle='collapse'
          href='#cardnotes'
        >
          Last Update: None
        </div>
      );
    }
    return <U.GetUpdate obj={this.props.storeObj} />;
  }
}
// //////////////////////////////////////////////////////////////////////////////////////////
class DeletePopover extends React.Component {
  // //PROPS: handleDelete, header
  constructor(props) {
    super(props);
    this.state = {
      isPopoverOpen: false,
    };
  }

  handleDelete() {
    store.dispatch(A.deleteObject(this.props.type, this.props.signature));
    socket.emit('deleteObject', {
      type: this.props.type,
      key: this.props.signature,
    });
  }

  render() {
    return (
      <Popover.default
        isOpen={this.state.isPopoverOpen}
        position='left' // preferred position
        onClickOutside={() => this.setState({ isPopoverOpen: false })}
        content={
          <div id='submit_popover'>
            <p>{this.props.header}</p>
            <button
              className='popover_submit_btn'
              onClick={() => this.handleDelete()}
            >
              <img
                className='popover_submit_img'
                src='https://cdn.glitch.com/6393f3fd-16a7-4641-ae3d-994f8e7cea4e%2Fcheckmark.png?1546938883091'
              />
            </button>
            <button
              className='popover_submit_btn'
              onClick={() => this.setState({ isPopoverOpen: false })}
            >
              <img
                className='popover_submit_img'
                src='https://cdn.glitch.com/6393f3fd-16a7-4641-ae3d-994f8e7cea4e%2FX%20icon%20small.png?1546753641488'
              />
            </button>
          </div>
        }
      >
        <button
          className='card_remove_btn'
          onClick={() =>
            this.setState({ isPopoverOpen: !this.state.isPopoverOpen })
          }
        >
          <img
            className='card_remove_image'
            src='https://cdn.glitch.com/dd3f06b2-b7d4-4ccc-8675-05897efc4bb5%2FX.png?1557668374293'
          />
        </button>
      </Popover.default>
    );
  }
}
const LastUpdate = connect(U.GetStoreProps)(LastUpdate_);
const connectedNotes = connect(U.GetStoreProps)(Notes);
export default {
  Notes: connectedNotes,
  UpdateObject,
  LastUpdate,
  DeletePopover,
};
