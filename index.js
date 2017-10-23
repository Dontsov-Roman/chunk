import React,{Component} from 'react';
import PropTypes from 'prop-types';

class Chunk extends Component{
    static defaultProps = {
      showLoading: false,
      preload    : true,
      show       : true,
      loader     : <div>Loading...</div>
    };

    static propTypes = {
      load       : PropTypes.func.isRequired,
      loader     : PropTypes.node.isRequired,
      show       : PropTypes.bool,
      preload    : PropTypes.bool,
      component  : PropTypes.string,
      showLoading: PropTypes.bool,
    };

    state = { LoadedComponent: null };

  componentWillMount() {
    if (this.props.preload) this.load(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const { load, component, show } = nextProps;
    if (
      this.props.load !== load ||
      this.props.component !== component ||
      (this.props.show !== show && show)
    ) {
      this.load(nextProps);
    }
  }

  load(props) {
    this.setState({ LoadedComponent: null });
    props.load().then(mod => {
      this.setState({
        LoadedComponent: props.component ? mod[props.component] : mod.default,
      });
    });
  }

  renderLoading = () => this.props.showLoading ? (<div>{this.props.loader}</div>) : null;

  render() {
    const { LoadedComponent } = this.state;
    const  { show, ...props } = this.props;
    delete props.load;
    delete props.component;
    if (!show) return null;
    return LoadedComponent ? <LoadedComponent {...props} /> : this.renderLoading();
  }
}
