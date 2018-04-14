<Cabbage>
form size(510, 400), caption("NiMPTi 65 in Space"), colour(255, 255, 255) pluginID("plu1")
groupbox bounds(4, 168, 94, 159), text("Drums"),fontcolour(200, 200, 200)  outlinethickness(0)
rslider bounds(12, 192, 75, 69), channel("drumVol"), range(0, 5, 1), text("Volume")
button bounds(22, 266, 60, 30), channel("triggerChange"), text("Shuffle")

groupbox bounds(4, 14, 94, 150), text("Track 1"), colour("red") fontcolour(0,0,0), outlinethickness(0)
rslider bounds(16, 44, 70, 70), channel("voice1vol"), textcolour(0,0,0)  trackercolour(:white) range(0, 1, 0), text("Volume")
button bounds(22, 120, 60, 30),  channel("voice1change"), text("Shuffle")

groupbox bounds(104, 14, 94, 150), text("Track 2"), colour("green") fontcolour(0,0,0)  outlinethickness(0)
rslider bounds(116, 44, 70, 70), channel("voice2vol"),  textcolour(0,0,0)   trackercolour(:white)   range(0, 1, 0), text("Volume")
button bounds(122, 120, 60, 30),  channel("voice2change"), text("Shuffle")

groupbox bounds(204, 14, 94, 150), text("Track 3"), colour("pink") fontcolour(0,0,0)  outlinethickness(0)
rslider bounds(216, 44, 70, 70), channel("voice3vol"),  textcolour(0,0,0)   trackercolour(:white)  range(0, 1, 0), text("Volume")
button bounds(222, 120, 59, 30), channel("voice3change"),  text("Shuffle")

groupbox bounds(304, 14, 94, 150), text("Track 4"), colour("yellow") fontcolour(0,0,0)  outlinethickness(0)
rslider bounds(316, 44, 70, 70), channel("voice4vol"), 	textcolour(0,0,0)  trackercolour(:white)   range(0, 1, 0), text("Volume")
button bounds(322, 120, 60, 30), channel("voice4change"),  text("Shuffle")

groupbox bounds(404, 14, 94, 150), text("Track 5"), colour("aqua") fontcolour(0,0,0)  outlinethickness(0)
rslider bounds(416, 44, 70, 70), channel("voice5vol"),  textcolour(0,0,0)   trackercolour(:white)  range(0, 1, 0), text("Volume")
button bounds(422, 120, 60, 30), channel("voice5change"),  text("Shuffle")

button bounds(112, 178, 80, 40), channel("fire"), text("Fire Missile")
button bounds(112, 224, 80, 40), channel("shuffleAll"), text("Shuffle All")
</Cabbage>
<CsoundSynthesizer>
<CsOptions>
-n -d -m0d -+rtmidi=NULL -M0 --midi-key-cps=4 --midi-velocity-amp=5
</CsOptions>
<CsInstruments>
sr = 44100
ksmps = 64    
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

;-------------------------------------------------------
; simple drum sequencer - 
instr Drums
    kVol chnget "drumVol"
    if(kVol>0) then
        kNewPattern init 0
        kTime phasor .5			; phasor
        kBeat = int(kTime*16)		; multiple 0-1 signal of phasor by 16 and cast to int
        kTrig changed kBeat	
        if kTrig==1 then		; in each new beat enter block
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
		
            ;increment kNewPattern on each beat
            kNewPattern=kNewPattern+1
        endif
    endif

    kNewPattern chnget "triggerChange"
    kTrig2 changed kNewPattern			; Using the changed opcode so we only enter the loop once.
    if kTrig2==1 then	; Otherwise we could end up triggering instr2 thousands of
        event "i", 2, 0, 0.01			; time a second
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
; really simple synth - voiced five times 
; with different notes/timbres
;-----------------------------------------------
instr Synth
    a1 init 0
    Schannel sprintf "voice%dvol", p6
    kGain chnget Schannel
    kGain port kGain, 1
    
    kNote oscil 1, 1/p4, p5
    
    if p8==1 then
        aEnv oscili 1, abs(p4), 1
    else
        aEnv=.5;
    endif
        a1 oscili aEnv, cpspch(kNote)*p7, p9
    outs (a1*.25)*kGain, (a1*.25)*kGain
endin

;-------------------------------------------------------------------------------
instr 20000
;a1, a2 monitor
;fout "/Users/walshr/sourcecode/CsoundUnity/Examples/SimpleDemoOSX3/Assets/Scripts/output.wav", 4, a1
endin

</CsInstruments>
<CsScore>
f0 z
f2 0 8 10 1 1
f3 0 1024 10 1 1
f1 0 4096 7 0.001 96 1 4000 0.001
f99 0 16 -2 7.00 0 7.05 7.05 0 0 0 7 7.05 7.00 6 6 7.00 7.07 7.05 7.05 0 0
f98 0 16 -2 7.00 7.04 7.05 7.04 0 0 0 7.04 7.05 7.00 5 5 7.00 7.07 7.05 7.05 0 0
f97 0 16 -2 7.00 7.04 7.05 7.04 0 0 0 7.04 7.05 7.00 5 5 7.00 7.07 7.05 7.05 0 0
f96 0 16 -2 7.00 7.04 7.05 7.04 0 0 0 7.04 7.05 7.00 5 5 7.00 7.07 7.05 7.05 0 0
f95 0 8 -2 0 0 7.0 6.09 7.09 8 8.07 0 0 7.0 6.09 7.09 8 8.07 0 0 7.0 6.09 7.09 8 8.07 0 
i20000 0 z
i2 0 .1
i3 0 z
i4 0 z
i5 0 z
;i"Fire" 0 1
i"Drums"	0	3600
;i"Explosion" 0 1
;pName		start	dur		freq	note table	voice	transp	env table
i"Synth" 	0 		3600	4 		99 			1		1		1   2
i"Synth" 	0 		3600 	2 		98			2		1		1   1
i"Synth" 	0 		3600 	-8 		97			3		2		1   1
i"Synth" 	0 		3600 	8 		95			4		1		2   1
i"Synth" 	0 		3600 	4 		96			5		2		1   1


</CsScore>
</CsoundSynthesizer>