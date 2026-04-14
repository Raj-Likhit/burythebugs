import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const SCREENS = { 
  HOME: 'home', 
  LANG: 'lang', 
  GAME: 'game', 
  RESULT: 'result', 
  LEADERBOARD: 'leaderboard' 
};

export const useGameStore = create(
  persist(
    (set, get) => ({
      screen: SCREENS.HOME,
      playerName: '',
      rollNo: '',
      chosenLanguage: '',
      currentBug: null,
      result: null,
      playedBugIds: [],
      currentRound: 1,
      cumulativeScore: 0,
      
      setScreen: (screen) => set({ screen }),
      setPlayerName: (name) => set({ playerName: name }),
      setRollNo: (roll) => set({ rollNo: roll }),
      setChosenLanguage: (lang) => set({ chosenLanguage: lang }),
      setCurrentBug: (bug) => set((state) => ({ 
        currentBug: bug, 
        playedBugIds: bug ? [...state.playedBugIds, bug.id] : state.playedBugIds 
      })),
      addPlayedBugId: (id) => set((state) => ({
        playedBugIds: [...state.playedBugIds, id]
      })),
      setResult: (result) => set({ result }),
      incrementRound: () => set((state) => ({ currentRound: state.currentRound + 1 })),
      addScore: (points) => set((state) => ({ cumulativeScore: state.cumulativeScore + points })),
      
      resetGameSession: () => set({
        result: null,
        currentBug: null
      }),
      
      clearAll: () => set({
        screen: SCREENS.HOME,
        playerName: '',
        rollNo: '',
        chosenLanguage: '',
        currentBug: null,
        result: null,
        playedBugIds: [],
        currentRound: 1,
        cumulativeScore: 0
      })
    }),
    {
      name: 'btb_tournament_progress',
      partialize: (state) => ({
        playerName: state.playerName,
        rollNo: state.rollNo,
        chosenLanguage: state.chosenLanguage,
        playedBugIds: state.playedBugIds,
        currentRound: state.currentRound,
        cumulativeScore: state.cumulativeScore,
        screen: (state.screen === SCREENS.GAME || state.screen === SCREENS.RESULT) ? SCREENS.LANG : state.screen
      })
    }
  )
);
