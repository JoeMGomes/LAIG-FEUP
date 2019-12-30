:- dynamic octo/8.
:- dynamic square/4.
:- dynamic turn/1.
:- dynamic end/1.
:- dynamic edge/2.
:- dynamic moveNo/1.

turn(1).
end(0).


octo(0 ,0,0,.,nn,nn,nn, 0).
octo(1 ,0,1,.,nn,nn, 0, 1).
octo(2 ,0,2,.,nn,nn, 1, 2).
octo(3 ,0,3,.,nn,nn, 2, 3).
octo(4 ,0,4,.,nn,nn, 3, 4).
octo(5 ,0,5,.,nn,nn, 4, 5).
octo(6 ,0,6,.,nn,nn, 5, 6).
octo(7 ,0,7,.,nn,nn, 6,nn).

octo(8 ,1,0,.,nn, 0,nn, 7).
octo(9 ,1,1,., 0, 1, 7, 8).
octo(10,1,2,., 1, 2, 8, 9).
octo(11,1,3,., 2, 3, 9,10).
octo(12,1,4,., 3, 4,10,11).
octo(13,1,5,., 4, 5,11,12).
octo(14,1,6,., 5, 6,12,13).
octo(15,1,7,., 6,nn,13,nn).

octo(16,2,0,.,nn, 7,nn,14).
octo(17,2,1,., 7, 8,14,15).
octo(18,2,2,., 8, 9,15,16).
octo(19,2,3,., 9,10,16,17).
octo(20,2,4,.,10,11,17,18).
octo(21,2,5,.,11,12,18,19).
octo(22,2,6,.,12,13,19,20).
octo(23,2,7,.,13,nn,20,nn).

octo(24,3,0,.,nn,14,nn,21).
octo(25,3,1,.,14,15,21,22).
octo(26,3,2,.,15,16,22,23).
octo(27,3,3,.,16,17,23,24).
octo(28,3,4,.,17,18,24,25).
octo(29,3,5,.,18,19,25,26).
octo(30,3,6,.,19,20,26,27).
octo(31,3,7,.,20,nn,27,nn).

octo(32,4,0,.,nn,14,nn,28).
octo(33,4,1,.,21,22,28,29).
octo(34,4,2,.,22,23,29,30).
octo(35,4,3,.,23,24,30,31).
octo(36,4,4,.,24,25,31,32).
octo(37,4,5,.,25,26,32,33).
octo(38,4,6,.,26,27,33,34).
octo(39,4,7,.,27,nn,34,nn).

octo(40,5,0,.,nn,28,nn,35).
octo(41,5,1,.,28,29,35,36).
octo(42,5,2,.,29,30,36,37).
octo(43,5,3,.,30,31,37,38).
octo(44,5,4,.,31,32,38,39).
octo(45,5,5,.,32,33,39,40).
octo(46,5,6,.,33,34,40,41).
octo(47,5,7,.,34,nn,41,nn).

octo(48,6,0,.,nn,35,nn,42).
octo(49,6,1,.,35,36,42,43).
octo(50,6,2,.,36,37,43,44).
octo(51,6,3,.,37,38,44,45).
octo(52,6,4,.,38,39,45,46).
octo(53,6,5,.,39,40,46,47).
octo(54,6,6,.,40,41,47,48).
octo(55,6,7,.,41,nn,48,nn).

octo(56,7,0,.,nn,42,nn,nn).
octo(57,7,1,.,42,43,nn,nn).
octo(58,7,2,.,43,44,nn,nn).
octo(59,7,3,.,44,45,nn,nn).
octo(60,7,4,.,45,46,nn,nn).
octo(61,7,5,.,46,47,nn,nn).
octo(62,7,6,.,47,48,nn,nn).
octo(63,7,7,.,48,nn,nn,nn).

square(nn, nn,nn, nn).
square(0 ,0,0,x).
square(1 ,0,1,x).
square(2 ,0,2,x).
square(3 ,0,3,x).
square(4 ,0,4,x).
square(5 ,0,5,x).
square(6 ,0,6,x).
square(7 ,1,0,x).
square(8 ,1,1,x).
square(9 ,1,2,x).
square(10,1,3,x).
square(11,1,4,x).
square(12,1,5,x).
square(13,1,6,x).
square(14,2,0,x).
square(15,2,1,x).
square(16,2,2,x).
square(17,2,3,x).
square(18,2,4,x).
square(19,2,5,x).
square(20,2,6,x).
square(21,3,0,x).
square(22,3,1,x).
square(23,3,2,x).
square(24,3,3,x).
square(25,3,4,x).
square(26,3,5,x).
square(27,3,6,x).
square(28,4,0,x).
square(29,4,1,x).
square(30,4,2,x).
square(31,4,3,x).
square(32,4,4,x).
square(33,4,5,x).
square(34,4,6,x).
square(35,5,0,x).
square(36,5,1,x).
square(37,5,2,x).
square(38,5,3,x).
square(39,5,4,x).
square(40,5,5,x).
square(41,5,6,x).
square(42,6,0,x).
square(43,6,1,x).
square(44,6,2,x).
square(45,6,3,x).
square(46,6,4,x).
square(47,6,5,x).
square(48,6,6,x).

moveNo(0).

%moveLog(MoveNo, Row, Col).
%moveNo(number).
