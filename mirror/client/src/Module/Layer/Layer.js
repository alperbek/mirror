import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';

const styles = theme => ({
    nested: {
        paddingLeft: props => theme.spacing.unit * props.deepth,
    }
})

class Layer extends Component {

    state = {
        open: false,
    }

    componentDidMount() {
        window.addEventListener('scroll', this.getMoreOnScrollBottom)
    }

    getMoreOnScrollBottom = () => {
        const isCurrentLayer =  this.props.module.state.layerId == this.props.layer.id

        if (window.scrollY == window.scrollMaxY && isCurrentLayer && !this.props.module.state.isLoading) {
            this.props.module.getLayerOutputs(this.props.layer.id)
        } 
    }

    componentWillUnmount() {
        window.addEventListener('scroll', this.getMoreOnScrollBottom)
    }

    handleClick = (layer) => {
        this.setState(state => ({ open: !state.open }));
        this.props.module.getLayerOutputs(layer)
    }

    renderLayer = (layer) => {

        const name = this.props.layer.name.split('(')[0]

        return (<List>
            <ListItem button onClick={() => this.handleClick(this.props.layer)} >
                <ListItemText primary={name} />
                {this.state.open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                {layer.children.map((el, i) => (<Layer layer={el} module={this.props.module} key={i} deepth={this.props.deepth + 1}>
                </Layer>))}
            </Collapse>
        </List>
        )
    }

    render() {
        const layer = this.props.layer
        return (
            <List style={{ marginLeft: 8 * this.props.deepth / 2 }}>
                {layer ? this.renderLayer(layer) : (<ListItem></ListItem>)}
            </List>
        )
    }
}


export default Layer;
