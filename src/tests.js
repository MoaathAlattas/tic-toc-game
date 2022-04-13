/*
-- Tests
*/
//import { TictocBoardTests } from './tests'
/*
-- Tests
*/
  // ; (async () => {
  //   const tictocBoardTests = new TictocBoardTests();
  //   await tictocBoardTests.runAll();
  // })();

function assert(cond) {
    if (!cond) {
        throw Error("Assertion Error");
    }
}

export class TictocBoardTests {
    CLICK_EVENT = new Event("click", { bubbles: true });
    tictocBoard;
    cell_0;
    cell_1;
    cell_2;
    cell_3;
    cell_4;
    cell_5;
    cell_6;
    cell_7;
    cell_8;

    before() {
        this.tictocBoard = document.querySelector("tictoc-board");
        this.cell_0 = this.tictocBoard?.querySelector('[data-pos="0"]');
        this.cell_1 = this.tictocBoard?.querySelector('[data-pos="1"]');
        this.cell_2 = this.tictocBoard?.querySelector('[data-pos="2"]');
        this.cell_3 = this.tictocBoard?.querySelector('[data-pos="3"]');
        this.cell_4 = this.tictocBoard?.querySelector('[data-pos="4"]');
        this.cell_5 = this.tictocBoard?.querySelector('[data-pos="5"]');
        this.cell_6 = this.tictocBoard?.querySelector('[data-pos="6"]');
        this.cell_7 = this.tictocBoard?.querySelector('[data-pos="7"]');
        this.cell_8 = this.tictocBoard?.querySelector('[data-pos="8"]');
    }
    after() {
        this.tictocBoard.resetBtn.dispatchEvent(this.CLICK_EVENT);
    }
    async run(test, name) {
        this.before();
        try {
            await test();
        } catch (e) {
            console.log(`${e.message}: ${name}`);
        } finally {
            this.after();
        }
    }
    async runAll() {
        await this.run(this.test_happy_path_winner_x, "test_happy_path_winner_x");
        await this.run(this.test_happy_path_winner_o, "test_happy_path_winner_o");
        await this.run(this.test_happy_path_tie, "test_happy_path_tie");
        await this.run(this.test_player_switch, "test_player_switch");
        await this.run(
            this.test_can_not_play_when_cell_occupied,
            "test_can_not_play_when_cell_occupied"
        );
        await this.run(this.test_reset_board_state, "test_reset_board_state");
        await this.run(this.test_can_play_after_reset, "test_can_play_after_reset");

        await this.run(
            this.test_current_player_initial,
            "test_current_player_initial"
        );
        await this.run(
            this.test_current_player_after_play,
            "test_current_player_after_play"
        );
        await this.run(this.test_winner_msg, "test_winner_msg");
        await this.run(this.test_tie_msg, "test_tie_msg");
        await this.run(this.test_reset_board_dom, "test_reset_board_dom");
        await this.run(this.test_win_data_attr, "test_win_data_attr");
        await this.run(
            this.test_undo_removes_recent_play,
            "test_undo_removes_recent_play"
        );
        await this.run(
            this.test_undo_in_the_beginning,
            "test_undo_in_the_beginning"
        );
        await this.run(this.test_undo_after_winning, "test_undo_after_winning");
        await this.run(this.test_undo_switch_player, "test_undo_switch_player");
    }

    // testHelpers
    win_x() {
        this.cell_0.dispatchEvent(this.CLICK_EVENT);
        this.cell_8.dispatchEvent(this.CLICK_EVENT);
        this.cell_1.dispatchEvent(this.CLICK_EVENT);
        this.cell_7.dispatchEvent(this.CLICK_EVENT);
        this.cell_2.dispatchEvent(this.CLICK_EVENT);
        return [0, 1, 2];
    }
    win_o() {
        this.cell_8.dispatchEvent(this.CLICK_EVENT);
        this.cell_0.dispatchEvent(this.CLICK_EVENT);
        this.cell_7.dispatchEvent(this.CLICK_EVENT);
        this.cell_1.dispatchEvent(this.CLICK_EVENT);
        this.cell_5.dispatchEvent(this.CLICK_EVENT);
        this.cell_2.dispatchEvent(this.CLICK_EVENT);
        return [0, 1, 2];
    }
    tie() {
        this.cell_0.dispatchEvent(this.CLICK_EVENT);
        this.cell_1.dispatchEvent(this.CLICK_EVENT);
        this.cell_2.dispatchEvent(this.CLICK_EVENT);
        this.cell_4.dispatchEvent(this.CLICK_EVENT);
        this.cell_3.dispatchEvent(this.CLICK_EVENT);
        this.cell_5.dispatchEvent(this.CLICK_EVENT);
        this.cell_8.dispatchEvent(this.CLICK_EVENT);
        this.cell_6.dispatchEvent(this.CLICK_EVENT);
        this.cell_7.dispatchEvent(this.CLICK_EVENT);
    }
    // tests
    // state changes
    test_happy_path_winner_x = async () => {
        this.win_x();
        assert(this.tictocBoard.state.winner === DEFAULT_PLAYER);
    };
    test_happy_path_winner_o = async () => {
        this.win_o();
        assert(this.tictocBoard.state.winner === PLAYER.TWO);
    };
    test_happy_path_tie = async () => {
        this.tie();
        assert(this.tictocBoard.state.winner === "");
    };
    test_player_switch = async () => {
        assert(this.tictocBoard.state.player === DEFAULT_PLAYER);
        this.cell_1.dispatchEvent(this.CLICK_EVENT);
        assert(this.tictocBoard.state.player === PLAYER.TWO);
        this.cell_2.dispatchEvent(this.CLICK_EVENT);
        assert(this.tictocBoard.state.player === DEFAULT_PLAYER);
    };
    test_can_not_play_when_cell_occupied = async () => {
        this.cell_1.dispatchEvent(this.CLICK_EVENT);
        this.cell_1.dispatchEvent(this.CLICK_EVENT);
        assert(this.cell_1.innerText === DEFAULT_PLAYER);
    };
    test_reset_board_state = async () => {
        this.win_x();
        this.tictocBoard.resetBtn.dispatchEvent(this.CLICK_EVENT);
        assert(
            JSON.stringify(this.tictocBoard.state) ===
            JSON.stringify(new tictocState())
        );
    };
    test_can_play_after_reset = async () => {
        this.tictocBoard.resetBtn.dispatchEvent(this.CLICK_EVENT);
        this.cell_1.dispatchEvent(this.CLICK_EVENT);
        this.cell_2.dispatchEvent(this.CLICK_EVENT);
        assert(this.cell_1.innerText === DEFAULT_PLAYER);
        assert(this.cell_2.innerText === PLAYER.TWO);
    };

    // dom changes
    test_current_player_initial = async () => {
        assert(this.tictocBoard.curPlayer.innerText === DEFAULT_PLAYER);
    };
    test_current_player_after_play = async () => {
        this.cell_0.dispatchEvent(this.CLICK_EVENT);
        assert(this.tictocBoard.curPlayer.innerText === PLAYER.TWO);
    };
    test_winner_msg = async () => {
        this.win_x();
        assert(this.tictocBoard.msg.innerText === this.tictocBoard.getResultMsg);
    };
    test_tie_msg = async () => {
        this.tie();
        assert(this.tictocBoard.msg.innerText === this.tictocBoard.getResultMsg);
    };
    test_reset_board_dom = async () => {
        this.win_x();
        this.tictocBoard.resetBtn.dispatchEvent(this.CLICK_EVENT);
        assert(this.tictocBoard.msg.innerText === "");
        assert(this.tictocBoard.curPlayer.innerText === DEFAULT_PLAYER);
        this.tictocBoard.cells.forEach((cell) => {
            assert(cell.innerText === "");
            assert(cell.dataset[WIN_DATA_ATTR] === null);
        });
    };
    test_win_data_attr = async () => {
        const winSeq = this.win_x();
        this.tictocBoard.cells.forEach((cell) => {
            const cell_attr = cell.dataset[WIN_DATA_ATTR];
            if (winSeq.includes(parseInt(cell.dataset.pos, 10))) {
                assert(cell_attr === "true");
            } else {
                assert(cell_attr === null);
            }
        });
    };
    test_undo_removes_recent_play = async () => {
        this.cell_1.dispatchEvent(this.CLICK_EVENT);
        this.cell_2.dispatchEvent(this.CLICK_EVENT);
        this.cell_3.dispatchEvent(this.CLICK_EVENT);
        assert(this.cell_3.innerText === PLAYER.ONE);
        this.tictocBoard.undoBtn.dispatchEvent(this.CLICK_EVENT);
        assert(this.cell_3.innerText === "");
    };
    test_undo_in_the_beginning = async () => {
        this.tictocBoard.undoBtn.dispatchEvent(this.CLICK_EVENT);
        assert(this.tictocBoard.curPlayer.innerText === DEFAULT_PLAYER);
    };
    test_undo_switch_player = async () => {
        this.cell_1.dispatchEvent(this.CLICK_EVENT);
        assert(this.tictocBoard.curPlayer.innerText === PLAYER.TWO);
        this.tictocBoard.undoBtn.dispatchEvent(this.CLICK_EVENT);
        assert(this.tictocBoard.curPlayer.innerText === DEFAULT_PLAYER);
    };
    test_undo_after_winning = async () => {
        this.win_x();
        assert(this.cell_0.dataset[WIN_DATA_ATTR] === "true");
        assert(this.cell_1.dataset[WIN_DATA_ATTR] === "true");
        assert(this.cell_2.dataset[WIN_DATA_ATTR] === "true");
        assert(this.tictocBoard.curPlayer.innerText === DEFAULT_PLAYER);
        this.tictocBoard.undoBtn.dispatchEvent(this.CLICK_EVENT);
        assert(this.cell_0.dataset[WIN_DATA_ATTR] === undefined);
        assert(this.cell_1.dataset[WIN_DATA_ATTR] === undefined);
        assert(this.cell_2.dataset[WIN_DATA_ATTR] === undefined);
        assert(this.tictocBoard.curPlayer.innerText === DEFAULT_PLAYER);
    };
}