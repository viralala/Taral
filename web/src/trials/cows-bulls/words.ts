// Word lists for Cows & Bulls. Everything is filtered at load time:
// uppercase, A-Z only, exact length, no repeated letters, no duplicates.

import { DICT_4 } from './dictionary'

const clean = (text: string, length: number): Set<string> => {
  const out = new Set<string>()
  for (const raw of text.split(/\s+/)) {
    const w = raw.toUpperCase()
    if (w.length !== length || !/^[A-Z]+$/.test(w)) continue
    if (new Set(w).size !== length) continue
    out.add(w)
  }
  return out
}

const SECRET_4 = `
able acre aged aids arch area army atom aunt back bake ball band bank barn base bath bead beak beam bean bear beat
bell belt bend bike bird bite blue boat body bold bone book boom born boss bowl brag bulb burn bush busy cafe cage
cake calm came camp card care cart case cash cast cave chat chef chin chip city clam clap claw clay clip club
coal coat code coin cold come cook cool cope cord core corn cost crab crew crop cube cure curl cute dame dare dark
dash data date dawn deaf dean dear deck deep deer desk dial dice diet dime dine dirt dish dive dock dome door dove
down drag draw drip drop drum duck dusk dust duty each earn east easy echo edge exit face fact fail fair fall fame
farm fast fate fear feed feel fern file fill film find fine fire firm fish fist five flag flat flip flow foam fold
folk food foot fork form fort four free frog from fuel full fund gain game gate gave gift girl give glad glow glue
goal goat gold golf gone good grab gray grew grin grip grow gulf hair half hall hand hang hard harm hate have hawk
head heal heap hear heat help herb herd here hero hide high hill hint hold hole home hood hook hope horn host hour
huge hunt hurt idea inch iron isle jail jazz join joke jump june just keen keep kick kind king kiss kite knit
lace lack lady lake lamp land lane lard last late lawn lazy lead leaf leak lean left lend lens life lift lime line
link lion list live load loaf loan lock long look lord lose loud love luck lump lung mail main make male mall many
mark mask mast math meal mean meat meet melt menu mice mild milk mind mine mint miss mist moon more moss most move
much nail name navy near neck need nest news next nice nine node none nose note oath odor once open oven over pace
pack page paid pain pair palm park part past path pave peak pear peel pick pile pine pink pipe plan play plot plug
plum plus poem poet pole pond pony pool poor port pose pour pray pull pump pure push quit race rack rain rake ramp
rank rare rate read real rely rent rest rice rich ride ring ripe rise risk road roam roar robe rock role roll roof
room root rope rose rude ruin rule rush safe sage sail salt same sand save seal seat seed seem self sell send ship
shoe shop show shut sick side sigh sign silk sing sink site size skin skip slam slap sled slid slim slip slow snow
soap sock soft soil sold sole some song soon sort soul soup spin spot star stay stem step stop such suit sure swam
swim tail take tale talk tall tank tape task taxi team tear tell tent term test text than that them then they thin
this tide tidy tile time tiny tire toad told tomb tone took tool torn tour town trap tray tree trim trip true tube
tune turn twin type unit upon used vale vase vast verb very vest view vine visa vote wage wait wake walk wall want
warm warn wash wave weak wear week well went were west what when whom wide wife wild will wind wine wing wire wise
wish with wolf wood wool word wore work worm wrap yard yarn year zero zone
`

const EXTRA_4 = `
abet ably abut ache acid acne aero afar ahem ahoy airy ajar akin alas ally alms also alto amid amok anew
ante anti apex aqua arid arks arms atop aura auto aver avid avow away awry axes axle baby bail bait bale balm bane
bang bard bare bark barb bash bask bats bawl bays beef been beer beet begs bets bevy bias bide bids bilk bill
bind bins bits blab bled blew blip blob blot blow blur boar boas bobs bode bogs boil bolt bomb bond bony boot
bore both bout bran bras brat bray bred brew brim brow buck buds buff bugs bulk bull bump bums bunk buoy burp bury
bust butt buys buzz byte cabs calf call cams cane cans caps carp cars cats cede cell cent chap chew chic
chop chow chub chug chum cite clad clan clef clod clog clop clot clue coax cobs cock coda cods cogs coil coke cola
colt coma comb cons coop cops cork cosy cots coup cove cows cozy crag cram crib crow cubs cues
cuff cult cups curb curd cusp cuts dabs dads daft dais dale damp dams darn dart daub days daze dead deal debt
deed defy deft deli demo dens dent deny dews dibs died dies digs dill dims dins dips dire disc dole doll dolt dons
dorm dose doth dots dour drab dram dray drew drub drug dubs dude duds duel dues duet duke dull duly dumb
dune dunk duos dupe dyed dyes eats ebbs ecru eddy edgy edit eels eggs egos elks elms else emit ends envy eons epic
eras ergo errs etch even ever evil ewes exam eyed eyes fads fain fang fans fare fats fawn fens
feud fibs figs fink fins fizz flab flak flap flax flay flea fled flew flex flit floe flog flop flub flux
foal foes fogs foil fond font fool ford fore foul fowl foxy frat fray fret fume furl furs fury fuse fuss
gabs gads gags gaff gala gale gall gals gape garb gash gasp gawk gaze gear geek gels gems gent germ gets gibe
gild gill gilt gins gird girt gist glib glob glum glut gnat gnaw goad gods goes gong gore gory gosh gout gown
grad gram grid grim grit grub guff gulp gums guns guru gush gust guts guys gyms hack hail hake hale hams hank hare
hark hasp hats haul haze hazy hems hens hers hews hick hies hips hire hiss hits hive hoax hobs hoed hogs hoot
hops hose hots howl hubs hued hues huff hugs hulk hull hump hums hung hunk hurl hush husk hymn ibex ibis icon
ides idle idly idol iffy inks inky inns into ions ires irks itch item jabs jack jade jags jamb jams jars jaws
jays jean jeer jell jerk jest jets jibe jigs jilt jinx jive jobs jock jogs jolt jots joys judo jugs jury juts kale
keel kegs kelp kept keys kids kill kiln kilt kink kips kits kiwi knew knob knot know labs lags laid lair lame
laps lark lash lass lath laud lava laws lays leas leek leer legs lent less lest lets levy
lewd liar lice lick lids lied lien lies lilt limb limp lint lips lisp lobe lobs loft logo logs loin
lone loop lops lore lorn loss lost lots lout lube lugs lull lure lurk lush lust lute lynx lyre mace made maid mane maps mare mart maze mead meek mega mend mesh mess mews mica mike mile mime mink mire mite mitt moan
moat mock mode mods mole molt moms monk mood mope mops mote moth mown mows muck muff mugs mule mull mums
murk muse mush musk must mute mutt myth nabs nags nape nary nave nays neat neon nerd nets nibs nick nigh
nips nobs nods noir nook norm nosy nous nuke null numb nuns nuts oafs oaks oars oats obey odds odes ogle ogre
oils oily okay omen omit ones only onto onus oozy opal opts opus oral orbs orca ores ours oust outs
oval ovum owed owes owls owns oxen pact pads pals pang pans pant pare pars pass pawn paws pays peas peat pegs
pelt pens pent peon perk perm pert pest pets pews pied pier pigs pika pike pill pimp pins pint pits pity
plea pled plod plop ploy plow pods poke poky polo pomp pons pops pore pork posh post posy pots pout
prep prey prig prim prod prop pros prow puck puff pugs puke puma punk puns punt puny pups pupa purr
putt pyre quad quay quiz rage rags raid rail rant raps rapt rash rats rave rays raze reap redo reed reef
reek reel refs rein rend reps revs rhea ribs rids rife rift rigs rile rill rims rind rink riot rips rite
robs rode rods roes roil rook romp rosy rote rots rove rubs ruby rued rues ruff
rugs rump rums rune runs runt ruse rust ruts sack sacs sags said sake sale sane sang sank saps sari sash
sate saga sawn saws says scab scam scan scar scat seam sear sect seer sees sewn sews sexy shag sham shed
shim shin shod shot shun sift silo silt sine sins sips sire sirs sits skid skew skim skis skit slab
slag slat slaw slay slew slit slob slog slop slot slug slum slur smog smug snag snap snip snob snot snub
snug soak soar sobs soda sods sofa sons sops sore sots sour sown sows span spar spas
spat spay spec sped spew spit spud spun spur stab stag stir stow stub stud stun suds sued sues suet sulk sums
sunk suns sups surf swab swag swan swap swat sway swig swum sync tabs tact tads tags tame tamp tans taps tarn
taro tars tart tarp taut teak teal teas teem teen tees temp tend tens tern tint tins tips toed
toes tofu toga toil toke toll tome tons toot tops tore tori tort toss tote tots tout tows toys tram
trek trod trot tsar tubs tuck tuft tugs tuna tuns turf tush tusk tutu twig twit tyke typo ugly
undo urge urns user uses vain vamp vane vans vary vats veal veer veil vein vend vent veto vial vice vied vies vile vino viol void vole volt vows wade wads waft wags waif wail wand wane wans ward ware warp wars wart wary wasp wavy waxy ways weal wean webs weds weed
weep weir weld welt wend wens wept wets whet whey whim whip whir whiz whoa wick wigs wilt wily wimp wink
wins wipe wiry wisp wits woes wold woke woks womb wont woof woos work worn wove wren writ yack yaks yams yank yaps yawl yawn yaws yeah yell yelp yens yoga yogi yoke yolk yore your
yowl yuan yule zany zaps zeal zest zeta zinc zing zips zits zoom zoos
`

const secrets = clean(SECRET_4, 4)

export const SECRETS: string[] = [...secrets]

export const GUESSES: Set<string> = new Set<string>([...secrets, ...clean(EXTRA_4, 4), ...clean(DICT_4, 4)])
