import Vue from 'vue';
import Vuex from 'vuex';
import socket from './socket';

Vue.use(Vuex);

const state: State = {
  roomId: 'deadbeef',
  roomName: '滅びの立会人と創造の観測者と',
  userName: 'ななし',
  gameType: 'DiceBot',
  shortcuts: [],
  logs: [],
  logBuffer: [],
  readyAnimation: true,
  activeAnimation: false,
  settings: {
    playSound: true,
    playDiceAnimation: true,
    showSystemInfo: true,
  },
};

const store = new Vuex.Store({
  state,
  mutations: {
    setRoomId(state, roomId) {
      state.roomId = roomId;
    },
    changeRoomName(state, newName) {
      state.roomName = newName;
    },
    changeUserName(state, newName) {
      state.userName = newName;
    },
    updateGameType(state, newType) {
      state.gameType = newType;
    },
    addShortcut(state, shortcut) {
      if (state.shortcuts.indexOf(shortcut) == -1) {
        state.shortcuts.push(shortcut);
      }
    },
    removeShortcut(state, shortcut: string) {
      const newList = state.shortcuts.filter((i) => i != shortcut);
      if (state.shortcuts != newList) {
        state.shortcuts = newList;
      }
    },
    appendLogBuffer(state, log: Log) {
      if (!state.settings.playDiceAnimation) {
        state.logs.unshift(log);
        return;
      }

      if (state.readyAnimation) {
        state.readyAnimation = false;
      }
      state.logBuffer.push(log);
    },
    appendLog(state, log: Log) {
      state.logs.unshift(log);
    },
    nextAnimation(state) {
      state.logBuffer.shift();
      if (state.logBuffer.length < 1) {
        state.readyAnimation = true;
      }
    },
    activateAnimation(state) {
      state.activeAnimation = true;
    },
    deactivateAnimation(state) {
      state.activeAnimation = false;
    },
    updateSoundSetting(state, val: boolean) {
      state.settings.playSound = val;
      localStorage.setItem('settings', JSON.stringify(state.settings));
    },
    updateAnimationSetting(state, val: boolean) {
      state.settings.playDiceAnimation = val;
      localStorage.setItem('settings', JSON.stringify(state.settings));
    },
    updateSystemInfoSetting(state, val: boolean) {
      state.settings.showSystemInfo = val;
      localStorage.setItem('settings', JSON.stringify(state.settings));
    },
    loadSettings(state) {
      const str = localStorage.getItem('settings');
      if (str == null) {
        return;
      }

      const settings = JSON.parse(str);
      if (settings.playSound != null) {
        state.settings.playSound = settings.playSound;
      }
      if (settings.playDiceAnimation != null) {
        state.settings.playDiceAnimation = settings.playDiceAnimation;
      }
      if (settings.showSystemInfo != null) {
        state.settings.showSystemInfo = settings.showSystemInfo;
      }
    },
  },
  actions: {
    joinRoom(context, roomId: string) {
      context.commit('setRoomId', roomId);
      socket.emit('join', roomId);
    },
    sendLog(context, log: Log) {
      socket.emit('log', log);
    },
  },
  getters: {
    readyAnimation(state) {
      return state.readyAnimation;
    },
  },
});
export default store;