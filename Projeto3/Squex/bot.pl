:- consult('data.pl').
:- consult('logic.pl').
:- use_module(library(lists)).
:- use_module(library(random)).


%checks if the octo with the Id is not used
isNotUsed(Id):-
	octo(Id,_,_,X,_,_,_,_),
	(X = '.').


%gets a list of possible moves to make
valid_moves(_, _, ListOfMoves):-
    findall(X, octo(X,_,_,'.',_,_,_,_), ListOfMoves).


%make a random move
%checks valid moves and choose a random
randomPlay(Player):-
    valid_moves(_,_,List),
    random_member(M, List),
    octo(M, Row, Col,_,_,_,_,_),
    placePiece(Player, Row, Col).

%stopcase for testAllOctos
%ends at X = 63
testAllOctos(63, Player, List, Newlist):-
    ((checkFinalMove(63, Player), append(List, [63], Newlist));append(List, [], Newlist)).


%checks all octos and see's if its possible to end
%if yes add to Newlist
testAllOctos(X, Player, List, Newlist):-
    ((checkFinalMove(X, Player), append(List, [X], Newlist2));append(List, [], Newlist2)),
    X1 is X+1, X =< 63,!,
    testAllOctos(X1, Player, Newlist2, Newlist).


%see if its possible to end with the next play
%if yes plays that if not does a randomPlay
smartPlay(Player):-
    testAllOctos(0,Player,_,A),
    A \== [],
    random_member(ID, A),
    octo(ID, Row, Col,_,_,_,_,_),
    placePiece(Player, Row, Col).


%in case that u cannot end in the next play do a random play
smartPlay(Player):-
    randomPlay(Player).


%takes a Id from octo and a Player
%and checks if there are any possition
%that can end the game
checkFinalMove(ID,Player):-
    octo(ID,Row, Col,Piece,A,B,C,D),
    Piece = .,
    square(A,G,H,S1),
    square(B,I,J,S2),
    square(C,K,L,S3),
    square(D,M,N,S4),
    turn(T),
    placePiece(Player,Row,Col),
    ((\+game_over(_,X),          %revert all the changes
    retractall(edge(ID,_)),
    retractall(edge(_,ID)),
    replaceFact(octo(ID,Row,Col,Player,Q,W,E,R),octo(ID,Row,Col,.,Q,W,E,R)), 
    replaceFact(end(_),end(0)),
    replaceFact(turn(_), turn(T)),
    replaceFact(square(A,_,_,_),  square(A,G,H,S1)),
    replaceFact(square(B,_,_,_),  square(B,I,J,S2)),
    replaceFact(square(C,_,_,_),  square(C,K,L,S3)),
    replaceFact(square(D,_,_,_),  square(D,M,N,S4)), fail);
    (game_over(_,X),             %revert all the changes
    retractall(edge(ID,_)),
    retractall(edge(_,ID)),
    replaceFact(octo(ID,Row,Col,Player,Q,W,E,R),octo(ID,Row,Col,.,Q,W,E,R)), 
    replaceFact(end(_),end(0)), 
    replaceFact(turn(_), turn(T)), 
    replaceFact(square(A,_,_,_),  square(A,G,H,S1)), 
    replaceFact(square(B,_,_,_),  square(B,I,J,S2)), 
    replaceFact(square(C,_,_,_),  square(C,K,L,S3)), 
    replaceFact(square(D,_,_,_),  square(D,M,N,S4)))).



    
    