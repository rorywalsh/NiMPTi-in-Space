<CsoundSynthesizer>
<CsOptions>
-m0d
</CsOptions>
<CsInstruments>
sr = 44100
ksmps = 32    
nchnls = 2
0dbfs = 1

; - Description
;
; A generative instrument featuring a simple drum seuqnecer using 4 very 
; basic drum models. Instrument one is always on and uses a phasor to create a master click
; that will trigger 16 potential beats per pattern. Clicking the 'Update Drums' button
; will trigger instrument 2, which updates the rhythms by generating a new sequence of 0s 
; and 1s for each of the drums rhythm tables.
;
; Coupled with this is a simple synth which is instantiated 5 times, each with a different
; set of notes and timbre. Each voice has a volume control and the notes in each can be
; shuffled by by hitting the change button in each voice strip.    
; Rory Walsh, 2014.

; TableShuffle UDO - posted to Csound list by Jim Aikin. Tableshuffle opcode not 
; working for some reason.. 
opcode TableShuffle, 0, i
       
iTabNum xin
ilen tableng iTabNum
kctr init ilen - 1
ktemp1 init 3.00
ktemp2 init 3.00
loop:
krand random 0, kctr
krand = int(krand)
ktemp1 table krand, iTabNum
ktemp2 table kctr, iTabNum
                tablew ktemp1, kctr, iTabNum
                tablew ktemp2, krand, iTabNum
kctr = kctr - 1
if kctr >= 1 goto loop
       
endop
        
giTable1 ftgen 100, 0, 16, 2, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0
giTable2 ftgen 101, 0, 16, 2, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0 
giTable3 ftgen 102, 0, 16, 2, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 
giTable4 ftgen 103, 0, 16, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0 

giWaveshape1 ftgen 0, 0, 1024, 10, 1 
giWaveshape2 ftgen 0, 0, 16, 10, 1, 0, .1, 0, 1, .5 

gaEnv1, gaEnv2, gaEnv3, gaEnv4, gaEnv5 init 0
;-------------------------------------------------------
; simple drum sequencer - 
instr MainInstrument
    kVol chnget "drumVol"
    kBeat init 0
    kMasterClock init 0
    a1, a2, a3, a4, a5 init 0
    kIndex1, kIndex2, kIndex3, kIndex4, kIndex5 init 0

    gaEnv2 oscili 1, 2, 1

    if metro(16)==1 then		; in each new beat enter block

        ;printk2 kMasterClock
        if kMasterClock%2 == 0 then
            kDrum1 tab kBeat, 100	; read value from tables, 1 indicates a hit
            if kDrum1 ==1 then
                event "i", 1000, 0, .25, .25
            endif
            kDrum2 tab kBeat, 101	
            if kDrum2 ==1 then
                event "i", 2000, 0, 1, 100, giWaveshape1, .25
            endif
            kDrum3 tab kBeat, 102
            if kDrum3 ==1 then
                event "i", 3000, 0, .25, 50, giWaveshape1, .25
            endif
            kDrum4 tab kBeat, 103
            if kDrum4 ==1 then
                event "i", 4000, 0, .1, 100, giWaveshape1, .25
            endif
            kBeat = (kBeat==15 ? 0 : kBeat+1)
        endif

        ;synth melodies
        if kMasterClock%chnget:k("voice1Freq") == 0 then
            kNote1 tab kIndex1, 99
            kIndex1 = (kIndex1==15 ? 0 : kIndex1+1)
            event "i", "Env", 0, 1/chnget:k("voice1Freq"), 1
        endif
	
        if kMasterClock%chnget:k("voice2Freq") == 0 then
            kNote2 tab kIndex2, 98
            kIndex2 = (kIndex2==15 ? 0 : kIndex2+1)
            ;en is controlled by oscillator
        endif

        if kMasterClock%chnget:k("voice3Freq") == 0 then
            kNote3 tab 15-kIndex3, 97 	;moves backwards
            kIndex3 = (kIndex3==15 ? 0 : kIndex3+1)
            event "i", "Env", 0, 1/chnget:k("voice3Freq"), 3, 8
        endif
        
        if kMasterClock%chnget:k("voice4Freq") == 0  then
            kNote4 tab kIndex4, 95
            kIndex4 = (kIndex4==15 ? 0 : kIndex4+1)
            gaEnv4 = .5
        endif

        if kMasterClock%chnget:k("voice5Freq") == 0  then
            kNote5 tab kIndex5, 98
            kIndex5 = (kIndex5==15 ? 0 : kIndex5+1)
            event "i", "Env", 0, 1/chnget:k("voice5Freq"), 5
        endif
	
        kMasterClock = (kMasterClock==15 ? 0 : kMasterClock+1)

    endif

    kNewPattern chnget "triggerChange"
    kTrig2 changed kNewPattern			; Using the changed opcode so we only enter the loop once.
    if kTrig2==1 then	; Otherwise we could end up triggering instr2 thousands of
        event "i", 2, 0, 0.01			; time a second
    endif

    kGain1 chnget "voice1vol"
    kGain1 port kGain1, 1
    kGain2 chnget "voice2vol"
    kGain2 port kGain2, 1
    kGain3 chnget "voice3vol"
    kGain3 port kGain3, 1
    kGain4 chnget "voice4vol"
    kGain4 port kGain4, 1
    kGain5 chnget "voice5vol"
    kGain5 port kGain5, 1   

    a1 oscili gaEnv1*kGain1, cpsmidinn(kNote1+chnget:k("voice1transp")), 2
    a2 oscili gaEnv2*kGain2, cpsmidinn(kNote2+chnget:k("voice2transp")), 1
    a3 oscili gaEnv3*kGain3, cpsmidinn(kNote3+chnget:k("voice3transp")), 1
    a4 oscili gaEnv4*kGain4, cpsmidinn(kNote4+chnget:k("voice4transp")), 1
    a5 oscili gaEnv5*kGain5, cpsmidinn(kNote5+chnget:k("voice5transp")), 1
    aMix = a1+a2+a3+a4+a5
    outs aMix*.2, aMix*.2

    kTextUpdated chnget "characterChanged"
    kRandomFreqForText randh 50, 10
    if changed(kTextUpdated) == 1 then
         event "i", 10, 0, .1, 50+abs(kRandomFreqForText), 0, .5;
    endif    
    
endin


;---------------------------------------------
; updates contents of drum tables and creates new rhythms
;---------------------------------------------
instr 2
    iCnt init 0		; iCnt will be our table index going from 0-15
    until iCnt>15 do	; until iCnt get to 15, enter this block 
        iVal1 random 0, 10			; create random values between 0 and 10.
        tabw_i (iVal1>2 ? 0 : 1), iCnt, 100	; If value is above 5 enter a 'hit'(1) to the table
        iVal2 random 0, 10			; at index iCnt, if less than 5 enter a 0
        tabw_i (iVal2>2 ? 0 : 1), iCnt, 101	; Changing the 2 to higher number between 
        iVal3 random 0, 10			; will increase the chances of a 'hit' 
        tabw_i (iVal3>2 ? 0 : 1), iCnt, 102
        iVal4 random 0, 10	
        tabw_i (iVal4>2 ? 0 : 1), iCnt, 103
        iVal5 random 0, 15	
        iCnt = iCnt+1
    enduntil
endin

;---------------------------------------------
; updates contents of note tables and creates new melodies
;---------------------------------------------
instr 3
    if changed(chnget:k("voice1change"))==1 then
        event "i", "ShuffleNotes", 0, 1, 99
        printks "Hello", 0
    elseif changed(chnget:k("voice2change"))==1 then
        event "i", "ShuffleNotes", 0, 1, 98
    elseif changed(chnget:k("voice3change"))==1 then
        event "i", "ShuffleNotes", 0, 1, 97
    elseif changed(chnget:k("voice4change"))==1 then
        event "i", "ShuffleNotes", 0, 1, 95
    elseif changed(chnget:k("voice5change"))==1 then
        event "i", "ShuffleNotes", 0, 1, 96
    endif
endin

instr ShuffleNotes
	TableShuffle p4
endin

;---------------------------------------------
; updates contents of note tables and creates new melodies
;---------------------------------------------
instr 4
    if changed:k(chnget:k("shuffleAll")) == 1 then
        event "i", "ShuffleNotes", 0, 1, 99
        event "i", "ShuffleNotes", 0, 1, 98
        event "i", "ShuffleNotes", 0, 1, 97
        event "i", "ShuffleNotes", 0, 1, 96
        event "i", "ShuffleNotes", 0, 1, 95
        event "i", 2, 0, 0.01
    endif
endin

;-----------------------------------------------
; really simple synth - voiced five times 
; with different notes/timbres
;-----------------------------------------------    
instr 5
    if changed:k(chnget:k("fire"))==1 then
        event "i", "Fire", 0, 1
        event "i", "Explosion", .5, 1
    endif
endin

instr Explosion
    a1 randi 1, 1500
    a3 oscil 1, 100, -1
    a2 expon .05, p3, .001
    outs a2*a1*a3, a2*a1*a3
endin

instr Fire
    a1 expon 500, p3, 0.001 
    a2 oscili 10, a1, -1
    aclip clip a2*a1, 2, .3
    outs aclip*.05, aclip*.05
endin
;---------------------------------------------
; extremly simple set of drums
;---------------------------------------------
instr 1000; hihat closed
iActive active p1
if iActive<2 then
	aamp      expon     .1,  0.05,   0.001
	arand     rand      aamp
	outs arand*p4, arand*p4
endif
endin

instr 2000; snare
iActive active p1
if iActive<2 then
	aenv1  expon  .1, 0.3, 0.005
	a1   oscili aenv1, p4, p5
	aamp      expon     .1,  0.2,   0.001
	arand     randi      aamp, 2500
	outs (a1+arand)*p6, (a1+arand)*p6
endif
endin

instr 3000; kick
iActive active p1
if iActive<2 then
	k1  expon    p4, 0.2, p4-40    
	aenv expon 1, p3, 0.001
	a1  poscil    aenv, k1, p5
	outs a1*p6, a1*p6
endif
endin

instr 4000; who konws...
iActive active p1
if iActive<2 then
	k1 expon .5, p3, 0.01
	a1 randi k1, p5
	a2 oscili a1, p4, p5
	outs a2*p6, a2*p6
endif
endin

;-----------------------------------------------
; really simple synth with 5 voices
;-----------------------------------------------
instr Synth
    kMasterClock init 0
    a1, a2, a3, a4, a5 init 0
    kIndex1, kIndex2, kIndex3, kIndex4, kIndex5 init 0
    if metro(16) == 1 then

        if(kMasterClock%4 == 0) then
            kNote1 tab kIndex1, 99
            kIndex1 = (kIndex1==15 ? 0 : kIndex1+1)
            event "i", "Env", 0, 1/4, 1
        endif
	
        if(kMasterClock%2 == 0) then
            kNote2 tab kIndex2, 98
            kIndex2 = (kIndex2==15 ? 0 : kIndex2+1)
            event "i", "Env", 0, 1/8, 2
        endif

        if(kMasterClock%4 == 0) then
            kNote3 tab 15-kIndex3, 97 	;moves backwards
            kIndex3 = (kIndex3==15 ? 0 : kIndex3+1)
            event "i", "Env", 0, 1/4, 3, 8
        endif
        
        if(kMasterClock%16 == 0) then
            kNote4 tab kIndex4, 95
            kIndex4 = (kIndex4==15 ? 0 : kIndex4+1)
            gaEnv4 = .5
        endif

        if(kMasterClock%4 == 0) then
            kNote5 tab kIndex5, 98
            kIndex5 = (kIndex5==15 ? 0 : kIndex5+1)
            event "i", "Env", 0, 1/4, 5
        endif
	
        kMasterClock = (kMasterClock==15 ? 0 : kMasterClock+1)
    endif

    a1 oscili .25*gaEnv1, cpsmidinn(kNote1+chnget:k("transp1")), 2
    a2 oscili .25*gaEnv2, cpsmidinn(kNote2+chnget:k("transp2")), 2
    a3 oscili .25*gaEnv3, cpsmidinn(kNote3+chnget:k("transp3")), 3
    a4 oscili .25*gaEnv4, cpsmidinn(kNote4+chnget:k("transp4")), 3
    a5 oscili .25*gaEnv5, cpsmidinn(kNote5+chnget:k("transp5")), 2
    aMix = a1+a2+a3+a4+a5
    outs aMix*.2, aMix*.2
endin

instr Env
    if p5 > 0 then
        aPhasor phasor p5
    else
        aPhasor phasor 1/p3
    endif
    if p4 == 1 then
        gaEnv1 tab aPhasor, 1, 1 
    elseif p4 == 2 then
        gaEnv2 tab aPhasor, 1, 1 
    elseif p4 == 3 then
        gaEnv3 tab aPhasor, 1, 1 
    elseif p4 == 4 then
        gaEnv4 tab aPhasor, 1, 1 
    elseif p4 == 5 then
        gaEnv5 tab aPhasor, 1, 1 
    endif
endin

;synth simple for intro text
instr 10
    aexp expon p6+0.001, p3, 0.01
    a1 oscil aexp, cpsmidinn(p4)
    kpan randh 1, .01, 2
    outs a1*abs(kpan), a1*(1-abs(kpan)) 
endin

;-------------------------------------------------------------------------------
instr 20000
;a1, a2 monitor
;fout "/Users/walshr/sourcecode/CsoundUnity/Examples/SimpleDemoOSX3/Assets/Scripts/output.wav", 4, a1
endin

</CsInstruments>
<CsScore>
f0 z
f1 0 4096 7 0.001 196 1 3900 0.001
f2 0 8 10 1 1
f3 0 16 10 1 0 1 0 1
f4 0 2 2 1 0

;                  p3      p4      p5            p6      p7     p8  p9
; ;pName		start	dur		freq	note table	voice	transp	env table
; i"Synth" 	0 		3600	4 		99 			1		1		1   2 ; freq 1/4 4 notes a second
; i"Synth" 	0 		3600 	2 		98			2		1		1   1 ; freq 1/8 8 notes a second
; i"Synth" 	0 		3600 	-8 		97			3		2		1   1 ; freq 1/8 2 notes a second
; i"Synth" 	0 		3600 	8 		95			4		1		2   1 ; freq 1/8 1 notes a second - table size 8
; i"Synth" 	0 		3600 	4 		96			5		2		1   1 ; freq 1/4 4 notes a second 
f99 0 16 -2 60 0 65 65 0 0 0 60 65 60 48 48 60 67 65 65 0 0
f98 0 16 -2 60 64 65 64 0 0 0 64 65 60 36 36 60 67 65 65 0 0
f97 0 16 -2 60 64 65 64 0 0 0 64 65 60 36 36 60 67 65 65 0 0
f96 0 16 -2 60 64 65 64 0 0 0 64 65 60 36 36 60 67 65 65 0 0
;0 0 7.0 6.09 7.09 8 8.07 0 0 
f95 0 16  -2 0 0 60 57 69 72 79 0 0 0 60 57 69 72 79 0





i20000 0 z
i2 0 .1
i3 0 z
i4 0 z
i5 0 z
i10 0 z
i"MainInstrument"	0	z
;i"Synth" 	0 	z



</CsScore>
</CsoundSynthesizer>
