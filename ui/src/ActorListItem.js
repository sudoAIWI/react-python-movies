export default function ActorListItem(props) {
    return (
        <div>
            <div>
                <strong>{props.actor.surname}</strong>
                {' '}
                <span>{props.actor.name}</span>
                {' '}
                <a onClick={props.onDelete}>Delete</a>
            </div>
        </div>
    );
}
