import type { AbilityContext } from './core/ability/AbilityContext';
import type { TriggeredAbilityContext } from './core/ability/TriggeredAbilityContext';
import type { GameSystem } from './core/gameSystem/GameSystem';
import type Card from './core/card/Card';
import type { IAttackProperties } from './gameSystems/AttackSystem';
import type { RelativePlayer, TargetMode, CardType, Location, EventName, PhaseName, LocationFilter } from './core/Constants';
import type { GameEvent } from './core/event/GameEvent';
import type { IActionTargetResolver, IActionTargetsResolver, ITriggeredAbilityTargetResolver, ITriggeredAbilityTargetsResolver } from './TargetInterfaces';

// ********************************************** EXPORTED TYPES **********************************************
export type ITriggeredAbilityProps = ITriggeredAbilityWhenProps | ITriggeredAbilityAggregateWhenProps;

// TODO: since many of the files that use this are JS, it's hard to know if it's fully correct.
// for example, there's ambiguity between IAbilityProps and ITriggeredAbilityProps at the level of PlayerOrCardAbility
export interface IAbilityProps<Context> {
    title: string;
    locationFilter?: Location | Location[];
    cost?: any;
    limit?: any;
    max?: any;
    targetResolver?: IActionTargetResolver;
    targetResolvers?: IActionTargetsResolver;
    cardName?: string;

    /**
     * Indicates whether the ability should allow the player to trigger an attack from a unit.
     * Can either be an {@link IInitiateAttack} property object or a function that creates one from
     * an {@link AbilityContext}.
     */
    initiateAttack?: IInitiateAttack | ((context: AbilityContext) => IInitiateAttack);

    printedAbility?: boolean;
    cannotTargetFirst?: boolean;
    effect?: string;
    effectArgs?: EffectArg | ((context: Context) => EffectArg);
    gameSystem?: GameSystem | GameSystem[];
    handler?: (context?: Context) => void;
    then?: ((context?: AbilityContext) => object) | object;
}

export interface IConstantAbilityProps<Source = any> {
    title: string;
    locationFilter?: LocationFilter | LocationFilter[];
    // TODO: what's the difference between condition and match?
    condition?: (context: AbilityContext<Source>) => boolean;
    match?: (card: Card, context?: AbilityContext<Source>) => boolean;
    targetController?: RelativePlayer;
    targetLocation?: Location;
    cardName?: string;

    // TODO: can we get a real signature here
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    ongoingEffect: Function | Function[];

    createCopies?: boolean;
}

export interface IInitiateAttack extends IAttackProperties {
    opponentChoosesAttackTarget?: boolean;
    opponentChoosesAttacker?: boolean;
    attackerCondition?: (card: Card, context: TriggeredAbilityContext) => boolean;
    targetCondition?: (card: Card, context: TriggeredAbilityContext) => boolean;
}

export interface IActionProps<Source = any> extends IAbilityProps<AbilityContext<Source>> {
        condition?: (context?: AbilityContext<Source>) => boolean;

        /**
         * If true, any player can trigger the ability. If false, only the card's controller can trigger it.
         */
        anyPlayer?: boolean;
        phase?: PhaseName | 'any';
    }

export type traitLimit = Record<string, number>;

export type EffectArg =
    | number
    | string
    | RelativePlayer
    | Card
    | { id: string; label: string; name: string; facedown: boolean; type: CardType }
    | EffectArg[];

export type WhenType = {
        [EventNameValue in EventName]?: (event: any, context?: TriggeredAbilityContext) => boolean;
    };

// TODO UPGRADES
// export interface IAttachmentConditionProps {
//     limit?: number;
//     myControl?: boolean;
//     opponentControlOnly?: boolean;
//     unique?: boolean;
//     faction?: string | string[];
//     trait?: string | string[];
//     limitTrait?: traitLimit | traitLimit[];
//     cardCondition?: (card: Card) => boolean;
// }

// ********************************************** INTERNAL TYPES **********************************************
interface ITriggeredAbilityWhenProps extends ITriggeredAbilityBaseProps {
    when: WhenType;
}

interface ITriggeredAbilityAggregateWhenProps extends ITriggeredAbilityBaseProps {
    aggregateWhen: (events: GameEvent[], context: TriggeredAbilityContext) => boolean;
}

interface ITriggeredAbilityBaseProps extends IAbilityProps<TriggeredAbilityContext> {
    collectiveTrigger?: boolean;
    targetResolver?: ITriggeredAbilityTargetResolver;
    targetResolvers?: ITriggeredAbilityTargetsResolver;
    handler?: (context: TriggeredAbilityContext) => void;
    then?: ((context?: TriggeredAbilityContext) => object) | object;

    /**
     * If true, the ability can be triggered by any player. If false, only the card's controller can
     * trigger it.
     */
    anyPlayer?: boolean;

    /**
     * Indicates if triggering the ability is optional (in which case the player will be offered the
     * 'Pass' button on resolution) or if it is mandatory
     */
    optional?: boolean;
}