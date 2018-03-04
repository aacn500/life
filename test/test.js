const expect = require('chai').expect;

const Game = require('..');

describe('Game', function() {
  describe('#constructor()', function() {

    it('defaults to a randomly generated 10x10 grid', function() {
      let g = new Game();
      expect(g.grid.length).to.equal(10);
      expect(g.grid[0].length).to.equal(10);
      expect(g.width).to.equal(10);
      expect(g.width).to.equal(10);
    });

    it('accepts an integer grid size as a parameter', function() {
      let g = new Game(5);
      expect(g.grid.length).to.equal(5);
      expect(g.grid.length).to.equal(5);
      expect(g.width).to.equal(5);
      expect(g.width).to.equal(5);
    });

    it('accepts a predefined 2d array to seed grid', function() {
      {
        let grid = [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ];
        let game = new Game(grid);
        expect(game.grid).to.have.deep.members([
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1]
        ]);
      }
    });

    it('accepts a string specifying custom rules', function() {
      let g = new Game(5, '1/1');
      expect(g.rules.survival).to.have.members([1]);
      expect(g.rules.birth).to.have.members([1]);

      g = new Game(5, '12/34');
      expect(g.rules.survival).to.have.members([1, 2]);
      expect(g.rules.birth).to.have.members([3, 4]);
    });

  });

  describe('#parseRules()', function() {

    it('parses rulestring with single elements', function() {
      let rules = Game.parseRules('1/1');
      expect(rules).to.have.property('survival');
      expect(rules.survival).to.have.members([1]);
      expect(rules).to.have.property('birth');
      expect(rules.birth).to.have.members([1]);
    });

    it('parses rulestring with multiple elements', function() {
      let rules = Game.parseRules('123/456');
      expect(rules).to.have.property('survival');
      expect(rules.survival).to.have.members([1, 2, 3]);
      expect(rules).to.have.property('birth');
      expect(rules.birth).to.have.members([4, 5, 6]);
    });

    it('parses valid but empty rulestring', function() {
      let rules = Game.parseRules('/');
      expect(rules).to.have.property('survival');
      expect(rules.survival).to.have.members([]);
      expect(rules).to.have.property('birth');
      expect(rules.birth).to.have.members([]);
    });

    describe('fails to parse invalid rulestrings', function() {

      it('no divider: \'11\'', function() {
        let noSlash = function() { return Game.parseRules('11'); };
        expect(noSlash).to.throw(TypeError);
      });

      it('non-numeric: \'one/two\'', function() {
        let rules = Game.parseRules('one/two');
        expect(rules).to.have.property('survival');
        expect(rules.survival[0]).to.be.NaN;
        expect(rules.survival[1]).to.be.NaN;
        expect(rules.survival[2]).to.be.NaN;
        expect(rules).to.have.property('birth');
        expect(rules.birth[0]).to.be.NaN;
        expect(rules.birth[1]).to.be.NaN;
        expect(rules.birth[2]).to.be.NaN;
      });

      it('empty: \'\'', function() {
        let empty = function() { return Game.parseRules(''); };
        expect(empty).to.throw(TypeError);
      });

    });
  });

  describe('#sumNeighbours()', function() {

    it('returns 0 in a grid of all 0s', function() {
      let grid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ];
      let game = new Game(grid);

      expect(game.sumNeighbours(1, 1)).to.equal(0);
    });

    it('is not affected by specified cell', function() {
      let grid = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
      ];
      let game = new Game(grid);

      expect(game.sumNeighbours(1, 1)).to.equal(0);
    });

    it('returns the number of live cells', function() {
      let grid = [
        [1, 1, 0],
        [0, 0, 1],
        [0, 1, 0]
      ];
      let game = new Game(grid);

      expect(game.sumNeighbours(1, 1)).to.equal(4);
    });

    it('does not count cells which are not neighbours', function() {
      let grid = [
        [0, 0, 0, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ];
      let game = new Game(grid);

      expect(game.sumNeighbours(1, 1)).to.equal(0);
    });

    it('counts the edge of the grid as having value 0', function() {
      let grid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ];
      let game = new Game(grid);

      expect(game.sumNeighbours(0, 0)).to.equal(0);

      grid = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1]
      ];
      game = new Game(grid);
      expect(game.sumNeighbours(0, 0)).to.equal(3);
      expect(game.sumNeighbours(1, 0)).to.equal(5);
    });

  });

  describe('#iterate()', function() {
    const rulestring = "23/3";

    describe('a live cell', function() {

      it('dies when its neighbours are not in survival rules', function() {
        let grid = [
          [0, 0, 0],
          [0, 1, 0],
          [0, 0, 0]
        ];
        let game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(0);

        grid = [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 0]
        ];
        game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(0);

        grid = [
          [1, 1, 1],
          [1, 1, 0],
          [0, 0, 0]
        ];
        game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(0);

        grid = [
          [1, 1, 1],
          [1, 1, 1],
          [0, 0, 0]
        ];
        game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(0);

        grid = [
          [1, 1, 1],
          [1, 1, 1],
          [1, 0, 0]
        ];
        game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(0);

        grid = [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 0]
        ];
        game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(0);

        grid = [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1]
        ];
        game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(0);
      });

      it('survives when its neighbours are in survival rules', function() {
        let grid = [
          [1, 1, 0],
          [0, 1, 0],
          [0, 0, 0]
        ];
        let game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(1);

        grid = [
          [1, 1, 1],
          [0, 1, 0],
          [0, 0, 0]
        ];
        game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(1);
      });

    });

    describe('a dead cell', function() {

      it('remains dead unless its neighbours are in birth rules', function() {
        let grid = [
          [0, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ];
        let game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(0);

        grid = [
          [1, 0, 0],
          [0, 0, 0],
          [0, 0, 0]
        ];
        game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(0);

        grid = [
          [1, 1, 0],
          [0, 0, 0],
          [0, 0, 0]
        ];
        game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(0);

        grid = [
          [1, 1, 1],
          [1, 0, 0],
          [0, 0, 0]
        ];
        game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(0);

        grid = [
          [1, 1, 1],
          [1, 0, 0],
          [0, 0, 0]
        ];
        game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(0);

        grid = [
          [1, 1, 1],
          [1, 0, 1],
          [0, 0, 0]
        ];
        game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(0);

        grid = [
          [1, 1, 1],
          [1, 0, 1],
          [1, 0, 0]
        ];
        game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(0);

        grid = [
          [1, 1, 1],
          [1, 0, 1],
          [1, 1, 0]
        ];
        game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(0);

        grid = [
          [1, 1, 1],
          [1, 0, 1],
          [1, 1, 1]
        ];
        game = new Game(grid, rulestring);
        game.iterate();

        expect(game.grid[1][1]).to.equal(0);

      });

      it('is born into a live cell when its neighbours are in the birth rules',
          function() {
            let grid = [
              [1, 1, 1],
              [0, 0, 0],
              [0, 0, 0]
            ];
            let game = new Game(grid, rulestring);
            game.iterate();

            expect(game.grid[1][1]).to.equal(1);
          });

    });

  });

});

describe('Game class meets the rules of Game of Life', function() {

  it('No interactions', function() {
    let grid = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    let game = new Game(grid);
    game.iterate();

    expect(game.grid[1][1]).to.equal(0);
  });

  it('Underpopulation', function() {
    let grid = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0]
    ];
    let game = new Game(grid);
    game.iterate();

    expect(game.grid[1][1]).to.equal(0);
  });

  it('Overcrowding', function() {
    let grid = [
      [1, 1, 1],
      [1, 1, 0],
      [0, 1, 0]
    ];
    let game = new Game(grid);
    game.iterate();

    expect(game.grid[1][1]).to.equal(0);
  });

  it('Survival', function() {
    let grid = [
      [1, 1, 0],
      [0, 1, 0],
      [0, 0, 0]
    ];
    let game = new Game(grid);
    game.iterate();

    expect(game.grid[1][1]).to.equal(1);

    grid = [
      [1, 1, 0],
      [1, 1, 0],
      [0, 0, 0]
    ];
    game = new Game(grid);
    game.iterate();

    expect(game.grid[1][1]).to.equal(1);
  });

  it('Birth', function() {
    let grid = [
      [1, 1, 0],
      [1, 0, 0],
      [0, 0, 0]
    ];
    let game = new Game(grid);
    game.iterate();

    expect(game.grid[1][1]).to.equal(1);
  });

  it('Example seeded grid', function() {
    let grid = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ];
    let game = new Game(grid);
    game.iterate();

    expect(game.grid[3][2]).to.equal(0);
    expect(game.grid[3][4]).to.equal(0);
    expect(game.grid[2][3]).to.equal(1);
    expect(game.grid[3][3]).to.equal(1);
    expect(game.grid[4][3]).to.equal(1);
  });
});
