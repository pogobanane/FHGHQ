import React from 'react';
import store from '../../../../redux/store';
import A from '../../../../redux/actions';
import socket from '../../../../_static/socket';

const repo = 'https://raw.githubusercontent.com/the-fellowship-of-the-warapi/Assets/master/Item Icons/';

export class IconPanel extends React.Component {
  constructor(props) {
    super(props);
    this.SpawnIcon = this.SpawnIcon.bind(this);
  }

  ToggleMenu() {
    store.dispatch(A.selectObject('artypanel', ''));
  }

  SpawnIcon(index) {
    const { center } = this.props.worldmap.refs.worldmap.viewport;
    const packet = {
      position: { x: center[1], y: center[0] },
      notes: '',
      type: index,
      lastupdate: new Date(),
    };
    const key = center[1] + center[0];
    store.dispatch(A.updateObject('misc_icon', packet, key));
    socket.emit('updateObject', {
      type: 'misc_icon',
      object: packet,
      key,
    });
  }

  GetIcon(index, src) {
    return (
      <button className="map_artycontrol_btn2" onClick={() => this.SpawnIcon(index)}>
        <img className="map_artycontrol_img" src={repo + src} />
      </button>
    );
  }

  render() {
    return (
      <>
        <div id="map_artycontrol_dropdown" className="collapse width">
          <div id="map_artycontrol_innerdiv">
            {this.GetIcon(25, 'Items/MortarItemIcon.png')}
            {this.GetIcon(26, 'Vehicles/GunboatColonial.png')}
            {this.GetIcon(27, 'Vehicles/ArtilleryIcon.png')}
            {this.GetIcon(28, 'Structures/StaticArtilleryStructureIcon.png')}
            {this.GetIcon(35, 'Structures/StaticArtilleryStructureIcon.png')}
            {this.GetIcon(34, 'Structures/LongRangedArtilleryIcon.png')}
          </div>
        </div>
        <button
          id="map_artycontrol_btn"
          onClick={() => this.ToggleMenu()}
          data-toggle="collapse"
          data-target="#map_artycontrol_dropdown"
        >
          <img
            id="map_artycontrol_main_img"
            src={`${repo}Structures/StaticArtilleryStructureIcon.png`}
          />
        </button>
      </>
    );
  }
}
