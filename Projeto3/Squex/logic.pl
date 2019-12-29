:- consult('data.pl').

%creates a 2 way edge
addEdge(X,Y):-
    assert(edge(Y,X)),
    assert(edge(X,Y)).

%removes 2 way edge's
removeEdge(X,Y):-
    retract(edge(Y,X)),
    retract(edge(X,Y)).



%takes a fact and replaces with another
replaceFact(OldFact, NewFact) :-
(   call(OldFact)
->  retract(OldFact),
	assertz(NewFact);
	true
).

%takes a Row and Col and see's if that space is ocupied
isUsed(Row, Col):-
	octo(_,Row, Col,X,_,_,_,_),
	\+ (X = '.').


%Checks if the octo with that Row and Col is ocupied with Player
checkOcto(Player, Row, Col):-
	octo(_,Row,Col,X,_,_,_,_),
	X = Player.


%checks if a move will create cut 
%with means that the other player will be able to do 2 moves
checkCut(SquareID,Player, ID1,ID2):-
	square(SquareID,_,_,S),
	(S \== Player , S \== x)->(
	turn(T),
	T \== -3,T \== 3,
	T1 is T * -3,
	replaceFact(turn(T), turn(T1)),
	removeEdge(ID1,ID2)
	).


%checks if there is going to be a square at the top left of the octo
placeSquareCE(Player, Row, Col):-
	R1 is Row-1, C1 is Col-1,
	checkOcto(Player, R1,C1),
	octo(ID,Row,Col,_,X,_,_,_),
	octo(ID1,R1,C1,_,_,_,_,_),
	octo(ID2,Row,C1,_,_,_,_,_),
	octo(ID3,R1,Col,_,_,_,_,_),
	addEdge(ID, ID1),
	(checkCut(X,Player,ID2,ID3);true),
	replaceFact(square(X,A,B,_),square(X,A,B,Player)).


%checks if there is going to be a square at the to right of the octo
placeSquareCD(Player, Row, Col):-
	R1 is Row-1, C1 is Col+1,
	checkOcto(Player, R1,C1),
	octo(ID,Row,Col,_,_,X,_,_),
	octo(ID1,R1,C1,_,_,_,_,_),
	octo(ID2,Row,C1,_,_,_,_,_),
	octo(ID3,R1,Col,_,_,_,_,_),
	addEdge(ID, ID1),
	(checkCut(X,Player,ID2,ID3);true),
	replaceFact(square(X,A,B,_),square(X,A,B,Player)).

%checks if there is going to be a square at the bottom left of the octo
placeSquareBE(Player, Row, Col):-
	R1 is Row+1, C1 is Col-1,
	checkOcto(Player, R1,C1),
	octo(ID,Row,Col,_,_,_,X,_),
	octo(ID1,R1,C1,_,_,_,_,_),
	octo(ID2,Row,C1,_,_,_,_,_),
	octo(ID3,R1,Col,_,_,_,_,_),
	addEdge(ID, ID1),
	(checkCut(X,Player,ID2,ID3);true),
	replaceFact(square(X,A,B,_),square(X,A,B,Player)).

%checks if there is going to be a square at the bottom right of the octo
placeSquareBD(Player, Row, Col):-
	R1 is Row+1, C1 is Col+1,
	checkOcto(Player, R1,C1),
	octo(ID,Row,Col,_,_,_,_,X),
	octo(ID1,R1,C1,_,_,_,_,_),
	octo(ID2,Row,C1,_,_,_,_,_),
	octo(ID3,R1,Col,_,_,_,_,_),
	addEdge(ID, ID1),
	(checkCut(X,Player,ID2,ID3);true),
	replaceFact(square(X,A,B,_),square(X,A,B,Player)).

%checks if there are going to be squares around the octo with the Row and Col
placeSquares(Player, Row, Col):-
	(placeSquareCE(Player, Row, Col);true),
	(placeSquareCD(Player, Row, Col);true),
	(placeSquareBE(Player, Row, Col);true),
	(placeSquareBD(Player, Row, Col);true).


%Places a edge between 2 octo's
placeEdge(Player,Row,Col, ID1):-
	checkOcto(Player,Row,Col),
	octo(ID,Row,Col,_,_,_,_,_),
	addEdge(ID,ID1).

%places a Player piece at that Row and Col
%and makes all the edges
placePiece(Player, Row, Col):-
	\+isUsed(Row, Col),
	replaceFact(octo(ID,Row, Col,_,A,B,C,D),octo(ID,Row, Col,Player,A,B,C,D)),
	placeSquares(Player,Row,Col),
	R1 is Row -1, R2 is Row +1, % check Hor and Vert edges
	C1 is Col -1, C2 is Col +1,
	(placeEdge(Player,R1,Col, ID);true),
	(placeEdge(Player,R2,Col, ID);true),
	(placeEdge(Player,Row,C1, ID);true),
	(placeEdge(Player,Row,C2, ID);true).

%% stackoverflow.com/questions/21161624/define-graph-in-prolog-edge-and-path-finding-if-there-is-a-path-between-two-ve
path(A,B) :-   % two nodes are connected, if
  walk(A,B,[]) % - if we can walk from one to the other,
  .            % first seeding the visited list with the empty list

walk(A,B,V) :-       % we can walk from A to B...
  edge(A,X) ,        % - if A is connected to X, and
  \+(member(X,V)) , % - we haven't yet visited X, and
  (                  % - either
    B = X            %   - X is the desired destination
  ;                  %   OR
    walk(X,B,[A|V])  %   - we can get to it from X
  )                  %
  .                  % Easy!



%stopstate for checkAllBlack 
%ends at 7 because of top row
checkAllBlack(7):-
	end(0),
	octo(7,_,_,P,_,_,_,_),
	P = b,
	checkWinBlack(7,56).


%check end state for black 
%x Id's from octo's
%black wins if connects top row to bottom row
checkAllBlack(X):-
	end(0),
	octo(X,_,_,P,_,_,_,_),
	((P = b,
	checkWinBlack(X,56));true),
	X1 is X+1, X1=<7,
	checkAllBlack(X1).


%stop state for checkWinBlack
%ends at 67 because of bottom row
checkWinBlack(X,63):-
	end(0),
	checkPath(X,63,-1).


%tacks a X(octo id) and see if it is connect to bottom row (octo's 56-63)
checkWinBlack(X,Y):-
	end(0),
	(checkPath(X,Y,-1),!; true),
	Y1 is Y+1, Y1 =< 63,
	checkWinBlack(X,Y1).

%stop state for checkAllWhite
%end at 56 because of first collum
checkAllWhite(56):-
	end(0),
	octo(56,_,_,P,_,_,_,_),
	P = @,
	checkWinWhite(56,7).


%checks end state for White
%X should start at 0
%white wins if left collum is connected to right collum
checkAllWhite(X):-
	end(0),
	octo(X,_,_,P,_,_,_,_),
	((P = @,
	checkWinWhite(X,7));true),
	X1 is X+8, X1=<56,
	checkAllWhite(X1).


%stopstate for checkWinWhite
%end at 63 because of right collum
checkWinWhite(X,63):-
	end(0),	
	checkPath(X,63,1).


%takes a X (octo's Id) and see if it is connect to right collum
checkWinWhite(X,Y):-
	end(0),
	((checkPath(X,Y,1),!); true),
	Y1 is Y+8, Y1 =< 63,
	checkWinWhite(X,Y1).

%takes 2 octo id's and see if they are connect with edges
%if they are replace the end fact to a 1
checkPath(X,Y,N):-
	end(0),
	path(X,Y),
	replaceFact(end(_), end(N)).



%checks if the game is over
%fail if not over	
game_over(_, Winner):-
	Winner is 0,
	(checkAllBlack(0);true),		
	(checkAllWhite(0);true),
	end(X),
	((X > 0, Winner is 1); true),
	((X < 0, Winner is -1); true),
	X \== 0.
