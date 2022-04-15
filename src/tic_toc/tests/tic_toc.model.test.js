
import { jest } from '@jest/globals';
import { TicTocModel, DEFAULT_PLAYER, PLAYER } from '../tic_toc.model.js'

let ticTocModel;
let plays = [];
const winScenario_player1 = (model) => {
  model.playOnce(0)
  model.playOnce(8)
  model.playOnce(1)
  model.playOnce(7)
  model.playOnce(2)
}
const winScenario_player2 = (model) => {
  model.playOnce(8)
  model.playOnce(0)
  model.playOnce(5)
  model.playOnce(1)
  model.playOnce(4)
  model.playOnce(2)
}
const noWinnerScenario = (model) => {
  model.playOnce(8)
  model.playOnce(0)
  model.playOnce(5)
  model.playOnce(1)
  model.playOnce(4)
}

describe('TicTocModel', () => {

  beforeAll(() => {
    ticTocModel = new TicTocModel();
  });

  beforeEach(() => {
    ticTocModel = new TicTocModel();
    plays = [{
      "value": "X",
      "position": 0,
      "win": false
    }, {
      "value": "O",
      "position": 8,
      "win": false
    }, {
      "value": "X",
      "position": 1,
      "win": false
    }, {
      "value": "O",
      "position": 7,
      "win": false
    }];
  });

  test("Verify initial values", () => {
    expect(ticTocModel).toMatchObject({
      "player": DEFAULT_PLAYER,
      "plays": [],
      "winner": ""
    });
  });

  // undo
  test("Verify undo a play", () => {
    ticTocModel.plays = [...plays];
    expect(ticTocModel.plays.length).toEqual(plays.length);
    ticTocModel.undo();
    const playsWithoutLast = [...plays].slice(0, plays.length - 1);
    expect(ticTocModel.plays.length).toEqual(plays.length - 1);
    expect(ticTocModel.plays).toEqual(playsWithoutLast);
    expect(ticTocModel.player).toEqual(plays[plays.length - 1].value);
    expect(ticTocModel.winner).toEqual("");
  })
  test("Verify undo before playing", () => {
    ticTocModel.undo();
    expect(ticTocModel).toEqual(ticTocModel);
  });
  test("Verify undo after a winner", () => {
    ticTocModel.plays = [...plays];
    ticTocModel.plays[0].win = true;
    ticTocModel.plays[1].win = true;
    ticTocModel.winner = plays[plays.length - 1].value;
    ticTocModel.undo();
    expect(ticTocModel.plays[0].win).toEqual(false);
    expect(ticTocModel.plays[1].win).toEqual(false);
    expect(ticTocModel.winner).toEqual("");
  })

  // reset
  test("Verify rest model values", () => {
    ticTocModel.plays.push({ xyz: "" });
    ticTocModel.winner = "X";
    expect(ticTocModel.playCount).toBe(1);
    expect(ticTocModel.isDone()).toBe(true);
    ticTocModel.reset();
    expect(ticTocModel.playCount).toBe(0);
    expect(ticTocModel.isDone()).toBe(false);
  });

  // setWinner
  test("Verify setting a winner and flagging plays", () => {
    ticTocModel.plays = [...plays];
    ticTocModel.checkWinner = jest.fn().mockReturnValue([0, 1, 2]);
    ticTocModel.setWinner();
    expect(ticTocModel.plays[0].win).toBe(true);
    expect(ticTocModel.plays[2].win).toBe(true);
    expect(ticTocModel.winner).toBe(ticTocModel.player);
  });
  test("Verify doesn't set a winner and nor flag plays", () => {
    ticTocModel.plays = [...plays];
    ticTocModel.checkWinner = jest.fn().mockReturnValue([]);
    ticTocModel.setWinner();
    expect(ticTocModel.plays[0].win).toBe(false);
    expect(ticTocModel.plays[2].win).toBe(false);
    expect(ticTocModel.winner).toBe("");
  });

  // nextPlayer
  test("Verify next player", () => {
    ticTocModel.player = PLAYER.ONE;
    expect(ticTocModel.nextPlayer).toBe(PLAYER.TWO);
    ticTocModel.player = PLAYER.TWO;
    expect(ticTocModel.nextPlayer).toBe(PLAYER.ONE);
  })

  // canPlay
  test("Verify canPlay", () => {
    ticTocModel.plays = [...plays];
    expect(ticTocModel.canPlay(10)).toBe(false);
    expect(ticTocModel.canPlay(0)).toBe(false);
    expect(ticTocModel.canPlay(5)).toBe(true);
    ticTocModel.winner = PLAYER.ONE;
    expect(ticTocModel.canPlay(5)).toBe(false);
  })

  // playOnce
  test("Verify call play once but can't play", () => {
    ticTocModel.plays = [...plays];
    ticTocModel.canPlay = jest.fn().mockReturnValue(false);
    ticTocModel.playOnce(5);
    expect(ticTocModel.plays).toEqual(plays);
  });
  test("Verify play once adds a new play", () => {
    ticTocModel.plays = [...plays];
    ticTocModel.canPlay = jest.fn().mockReturnValue(true);
    const newPlays = [...plays];
    newPlays[4] = {
      "value": ticTocModel.player,
      "position": 5,
      "win": false
    };
    ticTocModel.playOnce(5);
    expect(ticTocModel.plays).toEqual(newPlays);
  });
  test("Verify play once and set a winner", () => {
    ticTocModel.plays = [...plays];
    ticTocModel.canPlay = jest.fn().mockReturnValue(true);
    ticTocModel.checkWinner = jest.fn().mockReturnValue([0, 1, 2]);
    ticTocModel.setWinner = jest.fn();
    ticTocModel.playOnce(5);
    expect(ticTocModel.setWinner).toHaveBeenCalled();
  });
  test("Verify play once and doesn't set a winner", () => {
    ticTocModel.plays = [...plays];
    ticTocModel.canPlay = jest.fn().mockReturnValue(true);
    ticTocModel.checkWinner = jest.fn().mockReturnValue([]);
    ticTocModel.setWinner = jest.fn();
    ticTocModel.playOnce(5);
    expect(ticTocModel.setWinner).not.toHaveBeenCalled();
  });
  test("Verify play once and switch player", () => {
    ticTocModel.plays = [...plays];
    ticTocModel.canPlay = jest.fn().mockReturnValue(true);
    ticTocModel.isDone = jest.fn().mockReturnValue(false);
    ticTocModel.playOnce(5);
    expect(ticTocModel.player).toBe(PLAYER.TWO);
  });
  test("Verify play once and doesn't switch player", () => {
    ticTocModel.plays = [...plays];
    ticTocModel.canPlay = jest.fn().mockReturnValue(true);
    ticTocModel.isDone = jest.fn().mockReturnValue(true);
    ticTocModel.playOnce(5);
    expect(ticTocModel.player).toBe(PLAYER.ONE);
  })

  //checkWinner
  test("Verify check a winner return win condition", () => {
    winScenario_player1(ticTocModel);
    expect(ticTocModel.checkWinner()).toEqual([0, 1, 2]);
  });
  test("Verify check a winner doesn't return win condition", () => {
    noWinnerScenario(ticTocModel);
    expect(ticTocModel.checkWinner()).toEqual([]);
  })

})
