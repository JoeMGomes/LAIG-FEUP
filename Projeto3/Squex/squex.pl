:- consult('data.pl').
:- consult('bot.pl').
:- consult('logic.pl').

%stopcase for oformatLine
%ends at 7
oformatLine(X,7):-
	octo(_,X,7,C,_,_,_,_), format('~a   ', [C]).


%display's a row
%X - row 
%Y - Col
%Uses X and Y to check octo's values
oformatLine(X,Y):-
	octo(_,X,Y,C,_,_,_,_), format('~a   ', [C]),
	 Y1 is Y+1, Y1 < 8, oformatLine(X,Y1).	


%stopcase for oformatBoard
%ends at 7
oformatBoard(7):-
	write('@   '),oformatLine(7,0), write('@'), nl.


%displays whole board
%X - Row
%Uses X to go through all the rows
oformatBoard(X):-
	write('@   '), oformatLine(X,0), write('@'), nl,
	X1 is X+1, X1 < 8,
	write('@   '),oformatSquare(X,0),write('    @'), nl,
	oformatBoard(X1).


%stopcase for oformatSquare
%ends at 6
oformatSquare(S,6):-
	square(_,S,6,C), format('  ~a ', [C]).


%displays all the Squares
%S- Row
%R- Col
%Uses S and R to go through all the squares
oformatSquare(S,R):-
	square(_,S,R,C), format('  ~a ', [C]),
	 R1 is R+1, R1 < 7, oformatSquare(S,R1).	



%displays the board
display_game(_,_):-
	write('    0   1   2   3   4   5   6   7'),nl,
	write('    b b b b b b b b b b b b b b b'),nl,nl,
	oformatBoard(0), nl,
	write('    b b b b b b b b b b b b b b b'), nl.
	



%Makes a player move
%Row
%Col
%checks if the move is valid, if yes does it
move(Row, Col):-
	turn(X),
	(X =< 0 ->		%b turn
		(
			placePiece('b', Row, Col),
			(turn(A), A =< 0 ->
			(N is A+2,
			replaceFact(turn(A), turn(N)));true
			)
		)
	;				%@ turn
		(	
			placePiece('@', Row, Col),
			(turn(B), B >= 0 ->
			(N is B-2,
			replaceFact(turn(B), turn(N)));true
			)
		)
	),
	(game_over(_,_);true),
	turn(C),
	(C>0 , write('It is @\'s turn!');
	write('It is b\'s turn!')).


%bot makes a move
%level 1-random 2-tries to see the best move
playBot(Level):-
	end(0),
	turn(X),
	(X =< 0 ->
		(	
			(Level = 1 ->randomPlay('b');smartPlay('b')),
			(turn(Y), Y =< 0 ->
			(N is Y+2,
			replaceFact(turn(Y), turn(N)));true
		)
	)
	;	
	(
			(Level = 1 ->randomPlay('@');smartPlay('@')),
		(turn(Y), Y >= 0 ->
		(N is Y-2,
			replaceFact(turn(Y), turn(N)));true
			)
		)
		),
		
		turn(Z),

		(game_over(_,_);true),
		(Z>0 , write('It is @\'s turn!'), nl;
		write('It is b\'s turn!'), nl).	


%Player does a move and choose with bot level for the next move
%Row- player move
%Col- player move
%Level- bot level
moveVsBot(Row, Col, Level):-
	turn(X),
	(X >= 0 ->
		(	
			placePiece('@', Row, Col),
			(turn(B), B >= 0 ->
			(N is B-2,
			replaceFact(turn(B), turn(N)));true
			)
		)
	),
	(game_over(_,_);true),
	turn(A),
	(A < 0), 
	((A = -3, playBot(Level));true),
	playBot(Level),
	(A>0 , write('It is @\'s turn!');
	write('It is b\'s turn!')).
	

%Decides if bot plays randomly or smart
%level 1-random 2-smart
choose_move(_, Level, _):-
	turn(X),
	X < 0,
	playBot(Level).


%Makes 2 bots play together
botVsbot(Level):-
	end(0),
	playBot(Level),!,
	botVsbot(Level).


